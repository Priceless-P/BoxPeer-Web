import React from 'react';
import { ConfigProvider } from 'antd';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Contents from './pages/Content';
import Nav from './pages/Nav';
import ContentDetails from './pages/ContentDetails';
import CallbackPage from './pages/CallbackPage';
import { Layout } from 'antd';
import 'antd/dist/reset.css';

const App: React.FC = () => {
    const theme = {
        token: {
            colorPrimary: '#AD49E1',
            colorBgBase: '#fff',
            colorTextBase: '#2E073F',
            colorTextSecondary: '#7A1CAC',
        },
    };

    return (
        <ConfigProvider theme={theme}>
            <Layout style={{ minHeight: '100vh' }}>
                <Router>
                    <Nav />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/contents" element={<Contents />} />
                        <Route path="/content/:cid" element={<ContentDetails />} />
                        <Route path="/callback" element={<CallbackPage />} />
                    </Routes>
                </Router>
            </Layout>
        </ConfigProvider>
    );
};

export default App;
