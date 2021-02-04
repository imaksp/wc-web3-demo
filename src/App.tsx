// import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import Container from 'react-bootstrap/Container';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import { toBN } from 'web3-utils';

import { useState } from 'react';
import { contracts } from './data/contracts';

let wcProvider: WalletConnectProvider;
let web3: Web3;

const fakeUsdcContractAddress = '0x3dD3DfaAdA4d6765Ae19b8964E2BAC0139eeCb40';
const etherscanUrlRinkeby = 'https://rinkeby.etherscan.io';
const testSpenderContractAddress = '0xeca838F0a8A32321dc1647F6b666aBc8c09e6481';

function App() {
  const [wallet, setWallet] = useState('');

  const [processingApprove, setProcessingApprove] = useState(false);

  const [txHash, setTxHash] = useState('');

  const walletConnectInit = async () => {
    console.log('on connect click.');
    //  Create WalletConnect Provider
    wcProvider = new WalletConnectProvider({
      infuraId: process.env.REACT_APP_INFURA_ID,
    });
    try {
      //  Enable session (triggers QR Code modal)
      const result = await wcProvider.enable();
      setWallet(result[0]);
      console.log('connect result: ', result);
    } catch (error) {
      console.error('Could not connect wallet: ', error);
    }

    web3 = new Web3(wcProvider as any);
    console.log('web3 instance; ', web3);
  };

  const sendApprove = () => {
    setProcessingApprove(true);
    const usdcContract = new web3.eth.Contract(contracts['UsdcTest'].abi, fakeUsdcContractAddress);
    usdcContract.methods
      .approve(testSpenderContractAddress, toBN(0))
      .send({ from: wallet })
      .on('transactionHash', (hash: string) => {
        // ...
        console.log('Received txHash: ', hash);
      })
      .then((receipt: any) => {
        // TODO - check this, it never gets called with 1.3.4, but works with 1.2.11 (Try updating version in package.json)
        console.log('Received txn receipt: ', receipt);
        setTxHash(receipt.transactionHash);
        setProcessingApprove(false);
      });
  };

  const disconnectWallet = async () => {
    console.log('in disconnect');
    if (wcProvider) {
      await wcProvider.disconnect();
      setWallet('');
      console.log('wallet disconnected');
    }
  };

  return (
    <Container className="App" fluid>
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h3>WalletConnect</h3>
        <Container className="my-2">
          <Button onClick={walletConnectInit}>Connect Wallet</Button>
        </Container>
        {wallet.length > 0 && (
          <Container>
            <Container className="my-2">
              <p>
                <strong>Selected Wallet:</strong> {wallet}
              </p>
            </Container>

            <Container className="my-2">
              <p>
                <strong>Fake USDC (ERC20) contract address (Rinkeby):&nbsp;</strong>
                <a
                  rel="noreferrer"
                  target="_blank"
                  href={`${etherscanUrlRinkeby}/token/${fakeUsdcContractAddress}`}
                >
                  {fakeUsdcContractAddress}
                </a>
              </p>
            </Container>

            <Container className="my-2">
              <Button disabled={processingApprove} onClick={sendApprove} variant="info">
                {processingApprove && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    className="mr-2"
                    aria-hidden="true"
                  />
                )}
                Call ERC20 Approve (With zero amount)
              </Button>
              <Container className="mt-2">
                {txHash && (
                  <p>
                    <strong>Success Txn Hash:</strong> {txHash}
                  </p>
                )}
              </Container>
            </Container>

            <Container className="mt-5">
              <Button variant="danger" onClick={disconnectWallet}>
                Disconnect Wallet
              </Button>
            </Container>
          </Container>
        )}
        {wallet.length > 0 && (
          <p className="mt-2">
            <small>
              Disconnect & Connect again wallet if approve not working OR mobile screen is locked
              after connect.
            </small>
          </p>
        )}
      </header>
    </Container>
  );
}

export default App;
