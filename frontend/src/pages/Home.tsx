import { Layout, Typography, Button, Row, Col, Card, Timeline, Avatar } from 'antd';
import { WalletOutlined, SmileOutlined, ShareAltOutlined } from '@ant-design/icons';

import './HomePage.css';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
// const techStack = [
//     { title: 'Rust', icon: <ToolOutlined /> },
//     { title: 'Tauri', icon: <BuildOutlined /> },
//     { title: 'Actix', icon: <AppstoreAddOutlined /> },
//     { title: 'React + TypeScript + Vite', icon: <CodeOutlined /> },
//     { title: 'Antd', icon: <FireOutlined /> },
//     { title: 'Libp2p', icon: <ToolOutlined /> },
//   ];

const Home = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Hero Section */}
            <Content style={{ padding: '50px 0', background: '#7A1CAC', color: '#fff' }}>
                <Row justify="center" align="middle" gutter={32}>
                    <Col xs={24} md={12} style={{ textAlign: 'center', color: '#fff' }}>
                        <Title level={1} style={{ color: '#fff' }}>Decentralized Content Delivery Network</Title>
                        <Text style={{ fontSize: '18px', color: '#fff' }}>
                            Empowering fast and secure content delivery through a decentralized peer-to-peer network.
                        </Text>
                        <Row justify="center" gutter={16} style={{ marginTop: '30px' }}>
                            <Col>
                                <Button type="primary" size="large" href='https://github.com/Priceless-P/BoxPeer'>Get Started</Button>
                            </Col>
                            <Col>
                                <Button type="default" size="large" href='https://github.com/Priceless-P/BoxPeer'>Learn More</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={16} md={8} style={{ textAlign: 'center' }}>
                        <img src="/assets/boxpeer.png" alt="CDN" style={{ maxWidth: '100%', height: 'auto' }} />
                    </Col>
                </Row>
            </Content>

            {/* About Section */}
            <Content style={{ padding: '50px 80px', }}>
                <Row gutter={32} justify="center" align="middle">
                    <Col xs={24} md={12}>
                        <Title level={2}>A New way of File Sharing</Title>
                        <Paragraph style={{ fontSize: '16px', color: '#555' }}>
                        BoxPeer enables users to share and access digital content without relying on a central server,
                            using the Libp2p networking stack for peer discovery and data exchange, and the Aptos blockchain for decentralized ownership,
                            authentication, and payment handling. BoxPeer is written in Rust, using its powerful concurrency model to manage distributed systems with high performance and scalability. The more peers there are, the faster and more reliable file sharing becomes.
                        </Paragraph>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card bordered={false} hoverable style={{ backgroundColor: '#7A1CAC', color: '#fff' }}>
                            <Title level={3} style={{ color: '#fff' }}>Introducing BoxPeer</Title>
                            <Text style={{ color: '#fff' }}>
                                A new way to share flies, built for a world where users want more control and flexibility, with the added benefit of of being powered by a secure, fast, and decentralized blockchain.
                            </Text>
                        </Card>
                    </Col>
                </Row>
            </Content>


            {/* How It Works Section */}
            <Content style={{ padding: '50px 80px', }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: '40px', color: '#7A1CAC' }}>How It Works</Title>
                <Timeline mode="alternate">
                    <Timeline.Item color="green">
                        <Title level={4}>Step 1: Upload Content</Title>
                        <Text>
                            Content providers upload their files to the network.
                        </Text>
                    </Timeline.Item>
                    <Timeline.Item color="blue">
                        <Title level={4}>Step 2: Distribute</Title>
                        <Text>
                            The network automatically distributes the files to peers, ensuring redundancy and availability.
                        </Text>
                    </Timeline.Item>
                    <Timeline.Item color="red">
                        <Title level={4}>Step 3: Deliver</Title>
                        <Text>
                            When users request content, chunks are retrieved from peers, and delivered quickly.
                        </Text>
                    </Timeline.Item>
                    <Timeline.Item color="purple">
                        <Title level={4}>Step 4: Reward</Title>
                        <Text>
                            Nodes that delivers the content gets paid in APT.
                        </Text>
                    </Timeline.Item>
                    <Timeline.Item color="blue">
                        <Title level={4}>Step 5: Yay!</Title>
                        <Text>
                            Eveybody is happy :).
                        </Text>
                    </Timeline.Item>
                </Timeline>
            </Content>

            {/* Key Features Section */}
            <Content style={{ padding: '50px 80px', }} id="features">
                <Title level={2} style={{ textAlign: 'center', marginBottom: '40px', }}>Key Features</Title>
                <Row gutter={24}>
                    <Col xs={24} md={8}>
                        <Card hoverable style={{ background: '#EBD3F8' }}>
                            <Avatar size={64} icon={<WalletOutlined />} style={{ backgroundColor: '#AD49E1' }} />
                            <Title level={4} style={{ marginTop: '20px' }}>Faster Sharing</Title>
                            <Text>
                            Gets files from nearby devices for quick delivery
                            </Text>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card hoverable style={{ background: '#EBD3F8' }}>
                            <Avatar size={64} icon={<ShareAltOutlined />} style={{ backgroundColor: '#AD49E1' }} />
                            <Title level={4} style={{ marginTop: '20px' }}>File Replication</Title>
                            <Text>
                            Files are stored across multiple nodes, so, they’re always available and securely backed up.
                            </Text>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card hoverable style={{ background: '#EBD3F8' }}>
                            <Avatar size={64} icon={<SmileOutlined />} style={{ backgroundColor: '#AD49E1' }} />
                            <Title level={4} style={{ marginTop: '20px' }}>Open Source</Title>
                            <Text>
                            Built with open-source libraries and fully open-source
                            </Text>
                        </Card>
                    </Col>
                </Row>
            </Content>
            <Content style={{ paddingLeft: ' 80px', paddingRight: '80px', paddingTop: '10px', paddingBottom: '50px' }}>

                <Row gutter={24}>
                    <Col xs={24} md={8}>
                        <Card hoverable style={{ background: '#EBD3F8' }}>
                            <Avatar size={64} icon={<WalletOutlined />} style={{ backgroundColor: '#AD49E1' }} />
                            <Title level={4} style={{ marginTop: '20px' }}>Easy Wallet Setup</Title>
                            <Text>
                                BoxPeer uses Aptos Keyless to make setting up a wallet simple and seamless.
                            </Text>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card hoverable style={{ background: '#EBD3F8' }}>
                            <Avatar size={64} icon={<ShareAltOutlined />} style={{ backgroundColor: '#AD49E1' }} />
                            <Title level={4} style={{ marginTop: '20px' }}>Direct Connections</Title>
                            <Text>
                                Files are shared directly between users without needing a central server.
                            </Text>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card hoverable style={{ background: '#EBD3F8' }}>
                            <Avatar size={64} icon={<SmileOutlined />} style={{ backgroundColor: '#AD49E1' }} />
                            <Title level={4} style={{ marginTop: '20px' }}>Earn Rewards</Title>
                            <Text>
                                Earn APT for sharing files and resources with the network.
                            </Text>
                        </Card>
                    </Col>
                </Row>
            </Content>

            <Title level={1} style={{ textAlign: 'center', marginBottom: '40px' }}>Github</Title>
            <Content style={{ textAlign:'center' }}>
            <Button href='https://github.com/Priceless-P/BoxPeer'>BoxPeer</Button>
            </Content>
            {/* <Content >
            <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>Technology Stack</Title>
            <Row gutter={2} style={{ alignContent:'center' }}>
    {techStack.map((tech) => (
      <Col span={5} key={tech.title}>
    <Title level={5}>{tech.title} </Title>
      </Col>
    ))}
  </Row>
  </Content> */}

            {/* Footer Section */}
            <Content style={{ padding: '50px 0', color: '#7A1CAC', textAlign: 'center' }}>
                <Title level={4} style={{ color: '#7A1CAC' }}>BoxPeer </Title>
                <Text>© 2024 BoxPeer. All rights reserved.</Text>
            </Content>
        </Layout>
    );
};

export default Home;
