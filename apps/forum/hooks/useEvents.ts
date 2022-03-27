import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import useCommentsContract, { EventType } from "./useCommentsContract";

interface UseEventQuery {
  topic: string;
}

// Listen to events and refresh data
const useEvents = ({ topic }: UseEventQuery) => {
  const queryClient = useQueryClient();
  const commentsContract = useCommentsContract();

  useEffect(() => {
    const handler = (comment) => {
      if (comment.topic !== topic) {
        return;
      }
      // Invalidates query whose key matches passed array
      queryClient.invalidateQueries([
        "comments",
        { topic: comment.topic, chainId: commentsContract.chainId },
      ]);
    };

    commentsContract.contract.on(EventType.CommentAdded, handler);

    return () => {
      commentsContract.contract.off(EventType.CommentAdded, handler);
    };
  }, [queryClient, commentsContract.chainId, topic]);
};

export default useEvents;