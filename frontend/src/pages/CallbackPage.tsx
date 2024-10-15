import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useKeylessAccounts } from "../../../../BoxPeer/src/core/useKeylessAccounts";
import { Spin } from 'antd';

function CallbackPage() {
    const isLoading = useRef(false);
    const switchKeylessAccount = useKeylessAccounts(
        (state: { switchKeylessAccount: any; }) => state.switchKeylessAccount
    );
    const navigate = useNavigate();
    const location = useLocation();
    const fragmentParams = new URLSearchParams(window.location.hash.substring(1));
    const idToken = fragmentParams.get("id_token");

    useEffect(() => {
        if (isLoading.current) return;
        isLoading.current = true;

        async function deriveAccount(idToken: string) {
            try {
                await switchKeylessAccount(idToken);
                localStorage.setItem('walletConfigured', 'true');
                const previousPath = localStorage.getItem('previousPath') || '/';
                navigate(previousPath);

            } catch (error) {
                navigate('/');
                console.error("Error is here: ",error);
            }
        }

        if (!idToken) {
            navigate('/');
            return;
        }

        deriveAccount(idToken);
    }, [idToken, isLoading, navigate, switchKeylessAccount, location.state]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
            <Spin size="large" />
        </div>
    );
}

export default CallbackPage;
