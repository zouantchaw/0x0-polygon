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

    // Event for new comments
    event CommentAdded(Comment comment);

    // Fetch comments based on topic
    function getComments(string calldata topic)
        public
        view
        returns (Comment[] memory)
    {}

    // Persiste new comment
    function addComment(string calldata topic, string calldata message)
        public
    {}
}
