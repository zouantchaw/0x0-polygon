// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import 'hardhat/console.sol';

contract Domains {
    // "mapping" data type to store names
    mapping(string => address) public domains;

    constructor() {
        console.log('My domain contract');
    }

    // Adds names to mapping
    function register(string calldata name) public {
        // Check if name is unregistered
        require(domains[name] == address(0));
        domains[name] = msg.sender;
        console.log('%s has registered a domain!', msg.sender);
    }

    // Retrieve domain owners address
    function getAddress(string calldata name) public view returns (address) {
        return domains[name];
    }

    // Set record for registered name
    function setRecord(string calldata name, string calldata record) public {
        // Check if owner is transaction sender
        require(domains[name] == msg.sender);
        records[name] = record;
    }

    // Get record for registered name
    function getRecord(string calldata name) public view returns(string memory) {
      return records[name];
    }
}
