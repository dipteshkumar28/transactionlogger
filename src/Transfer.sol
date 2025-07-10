// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Transfer {
    event logTransaction(
        address indexed from,
        address indexed to,
        uint256 amount
    );

    function transfer(address to, uint256 amount) external {
        emit logTransaction(msg.sender, to, amount);
    }
}
