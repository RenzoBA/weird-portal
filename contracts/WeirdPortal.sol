// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract WeirdPortal {
    uint256 totalGreetings;
    uint256 private seed;

    event newGreeting(address indexed from, uint256 timestamp, string message);

    struct Greeting {
        address chum;
        uint256 timestamp;
        string message;
    }

    Greeting[] greetings;

    mapping(address => uint256) public lastGreetingAt;

    constructor() payable {
        console.log("Hey mom, I'm alive! :D");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function greeting(string memory _message) public {
        require(
            lastGreetingAt[msg.sender] + 5 minutes < block.timestamp,
            "wait 5 minutes"
        );
        lastGreetingAt[msg.sender] = block.timestamp;

        totalGreetings++;
        console.log("% send a message ", msg.sender, _message);

        greetings.push(Greeting(msg.sender, block.timestamp, _message));

        seed = (block.timestamp + block.difficulty + seed) % 100;
        console.log("Random # generated: %d ", seed);

        if (seed <= 50) {
            console.log("%s won! ", msg.sender);
            uint256 prizeAmount = 0.005 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }
        emit newGreeting(msg.sender, block.timestamp, _message);
    }

    function getAllGreetings() public view returns (Greeting[] memory) {
        return greetings;
    }

    function getTotalGreetings() public view returns (uint256) {
        console.log("Total greetings ", totalGreetings);
        return totalGreetings;
    }
}
