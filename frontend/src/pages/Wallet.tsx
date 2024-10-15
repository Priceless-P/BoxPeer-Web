import { Button, message, List } from 'antd';
import { GOOGLE_CLIENT_ID } from "../../../../BoxPeer/src/core/constants";
import useEphemeralKeyPair from "../../../../BoxPeer/src/core/useEphemeralKeyPair";
import GoogleLogo from "../../../../BoxPeer/src/components/GoogleLogo";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { useKeylessAccounts } from '../../../../BoxPeer/src/core/useKeylessAccounts';
import { collapseAddress } from '../../../../BoxPeer/src/utils/addressUtils';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { AccountAddress, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);

function Wallet() {
  const navigate = useNavigate();
  const ephemeralKeyPair = useEphemeralKeyPair();
  const [_walletAddress, setWalletAddress] = useState<string | null>(null);

  const [isListVisible, setListVisible] = useState(false);
  const [accountBalance, setAccountBalance] = useState<string | null>(null);
  const switchKeylessAccount = useKeylessAccounts(
    (state: { switchKeylessAccount: any; }) => state.switchKeylessAccount
);
const {activeAccount, disconnectKeylessAccount} = useKeylessAccounts();
const currentPath = window.location.pathname;
localStorage.setItem('previousPath', currentPath);
  useEffect(() => {
      if (activeAccount) {
          const getBalance = async () => {
              try {
                  const balance = await aptos.getAccountAPTAmount({
                      accountAddress: activeAccount.accountAddress as any as AccountAddress
                  });
                  const formattedBalance = (balance / 1e8).toFixed(4);
                  setAccountBalance(`${formattedBalance} APT`);
              } catch (error) {
                  console.error("Error fetching account balance:", error);
              }
          };
          getBalance();
      }
  }, [activeAccount]);

  useEffect(() => {
    const keylessAccount = localStorage.getItem('@aptos-connect/keyless-accounts');
    const walletC = localStorage.getItem('walletConfigured');
    if (keylessAccount && walletC) {
        try {
            const accountData = JSON.parse(keylessAccount);
            const account = accountData?.state?.accounts?.[0];

            if (account && account.idToken) {
                const { idToken } = account;
                const { exp } = JSON.parse(atob(idToken.raw.split('.')[1]));

                if (exp * 1000 > Date.now()) {
                    const id_token = `${idToken.raw}`;
                    async function deriveAccount(idToken: string) {
                        try {
                            await switchKeylessAccount(idToken);
                            console.log("Done")

                        } catch (error) {
                            console.log(error)
                        }
                    }
                    deriveAccount(id_token);
                }
            }
        } catch (error) {
            console.error("Error parsing account data:", error);
            message.error("Failed to retrieve wallet information.");
        }
    }
  }, [navigate, switchKeylessAccount]);

  const toggleListVisibility = () => {
    setListVisible((prev) => !prev);
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    disconnectKeylessAccount();
    message.success('Wallet disconnected.');
    setListVisible(false);
  };

  const redirectUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  const searchParams = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${window.location.origin}/callback`,
    response_type: "id_token",
    scope: "openid email profile",
    nonce: ephemeralKeyPair.nonce,
  });
  redirectUrl.search = searchParams.toString();

  return activeAccount ? (
    <div>
      <Button
        type="primary"
        size="large"
        icon={<GoogleLogo style={{ marginRight: 8 }} />}
        style={{ display: 'flex', alignItems: 'center' }}
        onClick={toggleListVisibility}
      >
        {collapseAddress(activeAccount.accountAddress.toString())}
      </Button>
      {isListVisible && (
        <List
          style={{ marginTop: 10 }}
          bordered
          dataSource={[
            `Account Balance: ${accountBalance !== null ? accountBalance : 'Loading...'}`,
            'Disconnect Wallet',
          ]}
          renderItem={(item, index) => (
            <List.Item
              onClick={index === 1 ? disconnectWallet : undefined}
              style={{ cursor: index === 1 ? 'pointer' : 'default' }}
            >
              {item}
            </List.Item>
          )}
        />
      )}
    </div>
  ) : (
    <Button
      type="primary"
      size="large"
      icon={<GoogleLogo style={{ marginRight: 8 }} />}
      href={redirectUrl.toString()}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      Connect Wallet
    </Button>
  );
}

export default Wallet;
