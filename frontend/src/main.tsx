import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PreviewProvider } from '../../../BoxPeer/src/context/PreviewContext.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
    <AptosWalletAdapterProvider>
        <PreviewProvider>
            <App />
        </PreviewProvider>
        </AptosWalletAdapterProvider>
    </StrictMode>,
)
