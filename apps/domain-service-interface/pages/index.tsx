import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import contractAbi from '../utils/contractABI.json';
import polygonLogo from '../assets/polygonlogo.png';
import ethLogo from '../assets/ethlogo.png';
import Image from 'next/image';
import { useAccount, useConnect, useNetwork } from 'wagmi';
import useDomainContract from '../hooks/useDomainContract';
import { useNames } from '../hooks/useNames';
import { useRecords } from '../hooks/useRecords';
import { useOwner } from '../hooks/useOwner';
import { createRecords } from '../utils/createRecords';

const tld = '.charaktor';
const CONTRACT_ADDRESS = '0x81163b5ffa646067B5f7575B344c75332F35359a'; 

export function Index() {

  const ownerQuery = useOwner('wiel');
  console.log('ownerQuery', ownerQuery.data);

  const namesQuery = useNames();
  console.log('names', namesQuery.data);

  const myRecord = useRecords('wiel');
  console.log('myRecord', myRecord.data);

  // const recordsQuery = createRecords(namesQuery.data);
  // console.log('recordsQuery', recordsQuery);

  const [accountQuery] = useAccount();

  const [connectQuery, connect] = useConnect();

  const [networkQuery] = useNetwork();

  console.log(networkQuery.data.chain?.name);

  console.log(connectQuery.data.connectors);

  const [loading, setLoading] = useState(false)

  const [mints, setMints] = useState([]);

  // const allMints = mintRecords(namesQuery.data);

  const [editing, setEditing] = useState(false);

  const [domain, setDomain] = useState('');
  const [record, setRecord] = useState('');

  const switchNetwork = async () => {
    if ((window as any).ethereum) {
      try {
        // Try to switch to the Mumbai testnet
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x13881' }], // Check networks.js for hexadecimal network ids
        });
      } catch (error) {
        // This error code means that the chain we want has not been added to MetaMask
        // In this case we ask the user to add it to their MetaMask
        if (error.code === 4902) {
          try {
            await (window as any).ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x13881',
                  chainName: 'Polygon Mumbai Testnet',
                  rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                  nativeCurrency: {
                    name: 'Mumbai Matic',
                    symbol: 'MATIC',
                    decimals: 18,
                  },
                  blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
                },
              ],
            });
          } catch (error) {
            console.log(error);
          }
        }
        console.log(error);
      }
    } else {
      // If window.ethereum is not found then MetaMask is not installed
      alert(
        'MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html'
      );
    }
  };

  const mintDomain = async () => {
    // Don't run if the domain is empty
    if (!domain) {
      return;
    }
    // Alert the user if the domain is too short
    if (domain.length < 3) {
      alert('Domain must be at least 3 characters long');
      return;
    }
    // Calculate price based on length of domain name
    // 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
    const price =
      domain.length === 3 ? '0.5' : domain.length === 4 ? '0.3' : '0.1';
    console.log('Minting domain', domain, 'with price', price);
    try {
      const { ethereum } = window as any;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractAbi.abi,
          signer
        );
        console.log(contract);

        console.log('Time to pay gas⛽️...');
        let tx = await contract.register(domain, {
          value: ethers.utils.parseEther(price),
        });
        // Wait for the transaction to be mined
        const receipt = await tx.wait();

        // Check if the transaction was successfully completed
        if (receipt.status === 1) {
          console.log(
            'Domain minted! https://mumbai.polygonscan.com/tx/' + tx.hash
          );

          // Set the record for the domain
          tx = await contract.setRecord(domain, record);
          await tx.wait();

          console.log(
            'Record set! https://mumbai.polygonscan.com/tx/' + tx.hash
          );

          // Call fetchMints after 2 seconds
          setTimeout(() => {
            fetchMints();
          }, 2000);

          setRecord('');
          setDomain('');
        } else {
          alert('Transaction failed! Please try again');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch all domains
  const fetchMints = async () => {
    console.log("inside fetchMints func")
    try {
      const { ethereum } = window as any;
      if (ethereum) {

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractAbi.abi,
          signer
        );

        // Get all the domain names from contract
        const names = await contract.getAllNames();

        // For each name, get the record and the address
        const mintRecords = await Promise.all(
          names.map(async (name) => {
            const mintRecord = await contract.records(name);
            const owner = await contract.domains(name);
            return {
              id: names.indexOf(name),
              name: name,
              record: mintRecord,
              owner: owner,
            };
          })
        );

        console.log('MINTS FETCHED ', mintRecords);
        setMints(mintRecords);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log('mints', mints);

  // update domain record
  const updateDomain = async () => {
    if (!record || !domain) {
      return;
    }
    setLoading(true);
    console.log('Updating domain', domain, 'with record', record);
    try {
      const { ethereum } = window as any;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractAbi.abi,
          signer
        );

        let tx = await contract.setRecord(domain, record);
        await tx.wait();
        console.log('Record set https://mumbai.polygonscan.com/tx/' + tx.hash);

        fetchMints();
        setRecord('');
        setDomain('');
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  // If wallet is not connected, render connect wallet button
  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <img
        src="https://www.charaktor.com/_next/static/images/banner-product-img-31f1eca34960fcd44c8e9e25f381486f.png"
        alt="Charaktor png"
      />
      <button
        onClick={() => {connect(connectQuery.data.connectors[0])}}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    </div>
  );

  // Form to enter domain name and data
  const renderInputForm = () => {
    if (networkQuery.data.chain?.name !== 'Mumbai') {
      return (
        <div className="connect-wallet-container">
          <p>Please connect to Polygon Mumbai Testnet</p>
        </div>
      );
    }

    return (
      <div className="form-container">
        <div className="first-row">
          <input
            type="text"
            value={domain}
            placeholder="domain"
            onChange={(e) => setDomain(e.target.value)}
          />
          <p className="tld"> {tld} </p>
        </div>

        <input
          type="text"
          value={record}
          placeholder="favorite emoji?"
          onChange={(e) => setRecord(e.target.value)}
        />
        {/* If the editing variable is true, return the "Set record" and "Cancel" button */}
        {editing ? (
          <div className="button-container">
            <button
              className="cta-button mint-button"
              // disabled={loading}
              onClick={updateDomain}
            >
              Set record
            </button>
            <button
              className="cta-button mint-button"
              onClick={() => {
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          // If editing is not true, the mint button will be returned instead
          <button
            className="cta-button mint-button"
            // disabled={loading}
            onClick={mintDomain}
          >
            Mint
          </button>
        )}
      </div>
    );
  };

  // Render all domain names
  const renderMints = () => {
    if (accountQuery.data?.address && mints.length > 0) {
      return (
        <div className="mint-container">
          <p className="subtitle"> Recently minted domains!</p>
          <div className="mint-list">
            {mints.map((mint, index) => {
              return (
                <div className="mint-item" key={index}>
                  <div className="mint-row">
                    <a
                      className="link"
                      href={`https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${mint.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p className="underlined">
                        {' '}
                        {mint.name}
                        {tld}{' '}
                      </p>
                    </a>
                    {/* If mint.owner is currentAccount, add an "edit" button*/}
                    {mint.owner.toLowerCase() ===
                    accountQuery.data?.address.toLowerCase() ? (
                      <button
                        className="edit-button"
                        onClick={() => editRecord(mint.name)}
                      >
                        <img
                          className="edit-icon"
                          src="https://img.icons8.com/metro/26/000000/pencil.png"
                          alt="Edit button"
                        />
                      </button>
                    ) : null}
                  </div>
                  <p> {mint.record} </p>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  // enable edit mode
  const editRecord = (name) => {
    console.log('Editing record for', name);
    setEditing(true);
    setDomain(name);
  };

  useEffect(() => {
    if (networkQuery.data.chain?.name === 'Mumbai') {
      fetchMints();
    }
  }, [accountQuery.data?.address, networkQuery.data.chain?.name]);

  // useEffect(() => {
  //   checkIfWalletIsConnected();
  // }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
              <p className="title">👤 Charaktor Name Service</p>
              <p className="subtitle">Access your CNS across the metaverse!</p>
            </div>
            <div className="right">
              <Image
                alt="Network logo"
                className="logo"
                src={networkQuery.data.chain?.name === 'Mumbai' ? polygonLogo : ethLogo}
                width={20}
                height={10}
              />
              {accountQuery.data?.address ? (
                <p>
                  {' '}
                  Wallet: {accountQuery.data?.address.slice(0, 6)}...
                  {accountQuery.data?.address.slice(-4)}{' '}
                </p>
              ) : (
                <p> Not connected </p>
              )}
            </div>
          </header>
        </div>

        {!accountQuery.data?.address && renderNotConnectedContainer()}
        {accountQuery.data?.address && renderInputForm()}
        {mints && renderMints()}

        <div className="footer-container"></div>
      </div>
    </div>
  );
}

export default Index;
