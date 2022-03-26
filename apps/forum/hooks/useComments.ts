import { useQuery } from 'react-query';
import useCommentsContract from './useCommentsContract';

interface UseCommentsQuery {
  topic: string;
}

// Fetch comments for a given topic when rendered
const useComments = ({ topic }: UseCommentsQuery) => {
  // invoke useCommentsContract hook to interact with contract 
  const contract = useCommentsContract();
  return useQuery(["comments", { topic, chainId: contract.chainId }], () =>
   contract.getComments(topic)
  );
};

export default useComments;