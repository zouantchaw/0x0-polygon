import * as React from "react";
import { Text, Heading, HStack, Stack } from "@chakra-ui/react";
import ReactTimeAgo from "react-time-ago"
import TimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en.json'
import Avatar from "@davatar/react";
import { Comment } from "../hooks/useCommentsContract";
import Username from "./Username";

interface CommentProps {
  comment: Comment;
}

TimeAgo.addDefaultLocale(en)

const Comment: React.FunctionComponent<CommentProps> = ({ comment }) => {
  return (
    <HStack spacing={3} alignItems="start">
      <Avatar size={48} address={comment.creator_address} />
      <Stack spacing={1} flex={1} bg="whiteAlpha.100" rounded="2x1" p={3}>
        <Heading color="whiteAlpha.900" fontSize="lg">
          <Username address={comment.creator_address} />
        </Heading>
        <Text color="whiteAlpha.800" fontSize="lg">
          {comment.message}
        </Text>
        <Text color="whiteAlpha.500" fontSize="md">
          <ReactTimeAgo date={comment.created_at.toNumber() * 1000} locale="en" />
        </Text>
      </Stack>
    </HStack>
  )

}
export default Comment;