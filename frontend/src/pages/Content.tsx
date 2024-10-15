import { useState, useEffect, useRef } from 'react';
import { Row, Col, Typography, Layout, Button, Spin } from 'antd';
import { useFileManager } from '../../../../BoxPeer/src/utils/fileUtils';
import { Link } from 'react-router-dom';
import { usePreview } from '../../../../BoxPeer/src/context/PreviewContext';

const { Title } = Typography;
const { Content } = Layout;

interface FileData {
  cid: string;
  fileData: Uint8Array;
}

const Contents = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const hasFetchedMetadata = useRef(false);
  const hasSentRequest = useRef(false);
  const { fileObjects, fetchFileMetadata, getAllFiles } = useFileManager();
  const { previewContent } = usePreview();

  useEffect(() => {
    const ws = new WebSocket('ws://127.0.0.1:9090/ws');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      try {
        // Expecting a JSON message in the format: { "cid": "Qm123...", "data": "base64-encoded-string" }
        const message = JSON.parse(event.data);
        if (message.cid && message.data) {
          const cid = message.cid;
          const fileData = new Uint8Array(atob(message.data).split('').map(char => char.charCodeAt(0)));

          // Update the files state only if the CID is unique
          setFiles((prevFiles) => {
            const newFile = { cid, fileData };
            if (!prevFiles.some((file) => file.cid === cid)) {
              return [...prevFiles, newFile];
            }
            return prevFiles;
          });
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    ws.onclose = (error) => {
      console.log('Disconnected from WebSocket', error);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const fetchDataAndRequestFiles = async () => {
      setLoading(true);

      // Only fetch metadata once if it hasn't been fetched already
      if (!hasFetchedMetadata.current) {
        await fetchFileMetadata();
        hasFetchedMetadata.current = true;
      }

      const cids = fileObjects.map((file) => file.cid).join(',');

      if (!cids || hasSentRequest.current) {
        setLoading(false);
        return;
      }

      // Send request to WebSocket to fetch files, but only once
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(`GET_FILES:${cids}`);
        hasSentRequest.current = true; // Mark request as sent to avoid duplicate requests
      } else {
        console.error('WebSocket connection is not open.');
      }

      setLoading(false);
    };

    fetchDataAndRequestFiles();
  }, [fileObjects]);

  useEffect(() => {
    if (files.length > 0) {
      getAllFiles(files);
    }
  }, [files]);
  console.log(previewContent)
  return (
    <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', margin: '0 18px' }}>
        <Title level={2} style={{ marginTop: '80px', marginBottom: '40px' }}>
          Available Content in the Network
        </Title>
        <Row gutter={[8, 8]} justify="center">
          {loading ? (
            <Spin />
          ) : previewContent.length > 0 ? (
            // Map directly over previewContent to display each element once
            previewContent.map(({ cid, element }) => (
              <Col xs={24} sm={12} md={8} key={cid}>
                <div>
                  {element}
                  <Link to={`/content/${cid}`}>
                    <Button type="primary" style={{ marginTop: '1px', marginBottom: '30px' }}>
                      View Details
                    </Button>
                  </Link>
                </div>
              </Col>
            ))
          ) : (
            <Spin />
          )}
        </Row>
      </div>
    </Content>
  );
};

export default Contents;
