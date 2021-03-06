import * as wagmi from 'wagmi';
import { useProvider, useSigner } from 'wagmi';
import type { BigNumber } from "ethers";

// import contract abi
import CommentsContract from "../Comments.json";

export interface Comment {
  id: string;
  topic: string;
  message: string;
  creator_address: string;
  created_at: BigNumber;
}

export enum EventType {
  CommentAdded = "CommentAdded",
}

const useCommentsContract = () => {
  // Initialize ethers.Signer instance
  const [signer] = useSigner();

  // Initialize ethers.Provider instance
  const provider = useProvider();

  // Initialize contract interaction
  const contract = wagmi.useContract({
    addressOrName: "0x060ac0E485a891fE8E72AcF719b1090cCfF10040",
    contractInterface: CommentsContract.abi,
    signerOrProvider: signer.data || provider,
  });

  // Invoke getComments function
  const getComments = async (topic: string): Promise<Comment[]> => {
    return contract.getComments(topic).then((comments) => {
      // iterate comments array, convert to object
      return comments.map((c) => ({ ...c }));
    });
  };

  // Invoke addComment function
  const addComment = async (topic:string, message:string): Promise<void> => {
    // Create transaction
    const tx = await contract.addComment(topic, message);
    // Wait for transaction to be mined
    await tx.wait();
  };

  console.log(contract.provider.network?.chainId)

  return {
    contract,
    chainId: contract.provider.network?.chainId,
    getComments,
    addComment,
  };
};

export default useCommentsContract;