// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import {StringUtils} from './libraries/StringUtils.sol';
import 'hardhat/console.sol';

contract Domains {
    // Record root domain
    string public tld;

    // "mapping" data type to store names
    mapping(string => address) public domains;
    // "mapping" to store values
    mapping(string => string) public records;

    // Make contract payable
    constructor(string memory _tld) payable {
        // Set root domain
        tld = _tld;
        console.log('%s name service deployed', _tld);
    }

    // Compute price of domain based on its length
    function price(string calldata name) public pure returns (uint256) {
        uint256 len = StringUtils.strlen(name);
        require(len > 0);
        if (len == 3) {
            // 5 MATIC = 5 000 000 000 000 000 000 (18 decimals).
            return 5 * 10**17;
        } else if (len == 4) {
            return 3 * 10**17; // 0.3 Matic
        } else {
            return 1 * 10**17;
        }
    }

    // Adds names to mapping
    function register(string calldata name) public payable {
        // Check if name is unregistered
        require(domains[name] == address(0));
        // Check if enough Matic was paid in transaction
        require(msg.value >= _price, 'Not enough Matic paid');

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
    function getRecord(string calldata name)
        public
        view
        returns (string memory)
    {
        return records[name];
    }
}
