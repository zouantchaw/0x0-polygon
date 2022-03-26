//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import 'hardhat/console.sol';

contract Comments {
    // Exposed data structure
    struct Comment {
        uint32 id;
        string topic;
        address creator_address;
        string message;
        uint256 created_at;
    }

    // For generating serial ids for comments
    uint32 private idCounter;

    // Mapping to store each topic
    mapping(string => Comment[]) private commentsByTopic;

    // Event for new comments
    event CommentAdded(Comment comment);

    // Fetch comments based on topic
    function getComments(string calldata topic)
        public
        view
        returns (Comment[] memory)
    {
        return commentsByTopic[topic];
    }

    // Persiste new comment
    function addComment(string calldata topic, string calldata message) public {
        // Create new comment in memory
        Comment memory comment = Comment({
            id: idCounter,
            topic: topic,
            creator_address: msg.sender,
            message: message,
            created_at: block.timestamp
        });
        // Push to commentsbyTopic mapping
        commentsByTopic[topic].push(comment);
        // Increment counter
        idCounter++;
        // Invoke new comment event
        emit CommentAdded(comment);
    }
}
