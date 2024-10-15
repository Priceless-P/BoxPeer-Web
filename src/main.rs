mod net;
mod node;
use actix::prelude::*;
use actix_web::{web, App, HttpRequest, HttpResponse, HttpServer, Error};
use actix_web_actors::ws;
use cid::Cid;
use libp2p::Multiaddr;
use std::sync::Arc;
use tokio::sync::Mutex;
use std::time::{Duration, Instant};
use crate::net::P2PCDNClient;


struct BinaryMessage {
    cid: Cid,
    data: Vec<u8>,
}
struct TextMessage(String);

// Implement `actix::Message` for these custom message types
impl Message for BinaryMessage {
    type Result = ();
}

impl Message for TextMessage {
    type Result = ();
}

// Shared state across WebSocket connections
struct AppState {
    client: Arc<Mutex<P2PCDNClient>>,
}

// WebSocket Actor
pub struct P2PWebSocket {
    state: web::Data<AppState>, // Shared state to access the P2PCDNClient
    hb: Instant,                // Heartbeat to track connection health
}

impl P2PWebSocket {
    pub fn new(state: web::Data<AppState>) -> Self {
        Self {
            state,
            hb: Instant::now(),
        }
    }

    /// Heartbeat check
    fn hb(&self, ctx: &mut <Self as Actor>::Context) {
        ctx.run_interval(HEARTBEAT_INTERVAL, |act, ctx| {
            if Instant::now().duration_since(act.hb) > CLIENT_TIMEOUT {
                println!("Client heartbeat failed, disconnecting!");
                ctx.stop();
                return;
            }
            ctx.ping(b"");
        });
    }
    fn handle_text_message(&mut self, ctx: &mut ws::WebsocketContext<Self>, text: String) {
        if text.starts_with("GET_FILES:") {
            let cid_strs = text.trim_start_matches("GET_FILES:");
            let cids: Vec<Cid> = cid_strs
                .split(',')
                .filter_map(|s| Cid::try_from(s.trim()).ok())
                .collect();

            if cids.is_empty() {
                ctx.text("No valid CIDs provided");
                return;
            }

            let state = self.state.clone();
            let addr = ctx.address(); // Cloneable address for async communication
            ctx.spawn(
                async move {
                    let mut client = state.client.lock().await;
                    // println!("Fetching file for CID: {:?}", &cids);
                    for cid_ in cids {
                        println!("Fetching file for CID: {:?}", &cid_);
                        match client.request_file(cid_).await {
                            Ok(file_data) => {
                                println!("Sending data for CID: {:?}", &cid_);
                                addr.do_send(BinaryMessage {
                                    cid: cid_,
                                    data: file_data,
                                });
                            }
                            Err(e) => {
                                let error_message = format!("Error fetching file for CID {}: {}", cid_, e);
                                addr.do_send(TextMessage(error_message));
                            }
                        }
                    }
                }
                .into_actor(self)
                .then(|_result, _act, _ctx| fut::ready(())),
            );
        } else {
            ctx.text("Unknown command");
        }
    }

}

// Implement Actor trait for WebSocket
impl Actor for P2PWebSocket {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        self.hb(ctx);
    }
}

// Implement the `actix::Handler` for the `BinaryMessage`
impl Handler<BinaryMessage> for P2PWebSocket {
    type Result = ();

    fn handle(&mut self, msg: BinaryMessage, ctx: &mut Self::Context) {
        let binary_data_base64 = base64::encode(msg.data);
        let message = format!(
            r#"{{ "cid": "{}", "data": "{}" }}"#,
            msg.cid.to_string(),
            binary_data_base64
        );
        ctx.text(message);
    }
}

// Implement the `actix::Handler` for the `TextMessage`
impl Handler<TextMessage> for P2PWebSocket {
    type Result = ();

    fn handle(&mut self, msg: TextMessage, ctx: &mut Self::Context) {
        ctx.text(msg.0);
    }
}

// Implement StreamHandler for handling WebSocket messages
impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for P2PWebSocket {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(ws::Message::Ping(msg)) => {
                self.hb = Instant::now();
                ctx.pong(&msg);
            }
            Ok(ws::Message::Pong(_)) => {
                self.hb = Instant::now();
            }
            Ok(ws::Message::Text(text)) => {
                self.handle_text_message(ctx, text.to_string());
            }
            Ok(ws::Message::Binary(bin)) => {
                ctx.binary(bin);
            }
            Ok(ws::Message::Close(reason)) => {
                ctx.close(reason);
                ctx.stop();
            }
            _ => ctx.stop(),
        }
    }
}

// WebSocket route handler
async fn ws_handler(req: HttpRequest, stream: web::Payload, state: web::Data<AppState>) -> Result<HttpResponse, Error> {
    let ws = P2PWebSocket::new(state.clone());
    ws::start(ws, &req, stream)
}

// Start the HTTP server and WebSocket handler
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let bootstrap_peers: Option<Vec<Multiaddr>> = Some(vec![
        "/ip4/203.161.57.50/udp/9090/quic-v1".parse().unwrap(),
    ]);
    let (client, _network_events, network_event_loop) = P2PCDNClient::new(bootstrap_peers, None).await.unwrap();

    // Spawn the network event loop
    tokio::spawn(network_event_loop.run());

    let app_state = web::Data::new(AppState {
        client: Arc::new(Mutex::new(client)),
    });

    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .route("/ws", web::get().to(ws_handler)) // WebSocket route
    })
    .client_request_timeout(Duration::from_secs(0))
    .client_disconnect_timeout(Duration::from_secs(0))
    .bind("127.0.0.1:9090")?
    .workers(2)
    .run()
    .await
}

// Heartbeat constants
const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(10);
const CLIENT_TIMEOUT: Duration = Duration::from_secs(30);
