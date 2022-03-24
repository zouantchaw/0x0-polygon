import { useEffect, useState } from 'react';
import styles from './index.module.css';

export function Index() {
  const [currentAccount, setCurrentAccount] = useState('');

  // Implement your connectWallet method here
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask -> https://metamask.io/');
        return;
      }

      // Request access to account.
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      // Print out public address once we authorize Metamask.
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // Check for ethereum object in window
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have metamask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }

    // Check if we're authorized to access the user's wallet
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    // Grab the first account
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }
  };

  // If wallet is not connected, render connect wallet button
  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <img
        src="https://www.charaktor.com/_next/static/images/banner-product-img-31f1eca34960fcd44c8e9e25f381486f.png"
        alt="Charaktor png"
      />
      <button onClick={connectWallet} className="cta-button connect-wallet-button">
        Connect Wallet
      </button>
    </div>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
              <p className="title">👤 Charaktor Name Service</p>
              <p className="subtitle">Access your DNS across the metaverse!</p>
            </div>
          </header>
        </div>

				{!currentAccount && renderNotConnectedContainer()}

        <div className="footer-container"></div>
      </div>
    </div>
  );
}

export default Index;
