import * as wagmi from 'wagmi';
import { useProvider, useSigner } from 'wagmi';

// import contract abi
import contractAbi from '../utils/contractABI.json';

const useDomainContract = () => {
  // Initialize ethers.Signer instance
  const [signer] = useSigner();

  // Initialize ethers.Provider instance
  const provider = useProvider();

  // Initialize contract interaction
  const contract = wagmi.useContract({
    addressOrName: '0x81163b5ffa646067B5f7575B344c75332F35359a',
    contractInterface: contractAbi.abi,
    signerOrProvider: signer.data || provider,
  });

  // Invoke register function
  const register = async (domain: string): Promise<void> => {
    // Create transaction
    const tx = await contract.register(domain);
    // Wait for transaction to be mined
    await tx.wait();
  }

  // Invoke setRecord function
  const setRecord = async (domain: string, record: string): Promise<void> => {
    // Create transaction
    const tx = await contract.setRecord(domain, record);
    // Wait for transaction to be mined
    await tx.wait();
  }

  // Invoke getRecord function
  const getRecord = async (domain: string): Promise<string> => {
    return contract.getRecord(domain).then((record) => {
      return record;
    });
  }

  // Invoke getAllNames function
  const getAllNames = async (): Promise<string[]> => {
    return contract.getAllNames().then((names) => {
      return names;
    });
  }

  // Invoke getAddress function
  const getAddress = async (domain: string): Promise<string> => {
    return contract.getAddress(domain).then((address) => {
      return address;
    });
  }

  const owner = async (name: string): Promise<string> => {
    return contract.domains(name).then((owner) => {
      return owner;
    });
  }

  return {
    contract,
    chainId: contract.provider.network?.chainId,
    register,
    setRecord,
    getRecord,
    getAllNames,
    getAddress,
    owner,
  };
}

export default useDomainContract;