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
        domains[name] = msg.sender;
        console.log('%s has registered a domain!', msg.sender);
    }

    // Retrieve domain owners address
    function getAddress(string calldata name) public view returns (address) {
        return domains[name];
    }
}
