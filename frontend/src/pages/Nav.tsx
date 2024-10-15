import { Menu, Layout } from 'antd';
import { Link } from 'react-router-dom';
import Wallet from './Wallet';

const { Header } = Layout;

const Nav = () => {
    return (
        <Header style={{ backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
            <Menu mode="horizontal" defaultSelectedKeys={['home']} style={{ flex: 1, justifyContent: 'center', borderBottom: 'none' }}>
                <Menu.Item key="home">
                    <Link to="/">Home</Link>
                </Menu.Item>
                <Menu.Item key="features">
                    <Link to="#features">Features</Link>
                </Menu.Item>
                <Menu.Item key="contact">
                    <Link to="/contents">Contents</Link>
                </Menu.Item>
            </Menu>
            <div style={{ marginLeft: 'auto', padding: '0 20px' }}>
                <Wallet />
            </div>
        </Header>
    );
}

export default Nav;
