
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EventTicket is ERC721URIStorage, Ownable {
    uint256 public ticketCount = 0;
    uint256 public maxTickets;
    uint256 public ticketPrice;
    string public eventName;
    string public eventDate;

    constructor(
    string memory _name,
    string memory _symbol,
    uint256 _maxTickets,
    uint256 _ticketPrice,
    string memory _eventName,
    string memory _eventDate
) ERC721(_name, _symbol) Ownable(msg.sender) {  // <-- Add Ownable(msg.sender)
    maxTickets = _maxTickets;
    ticketPrice = _ticketPrice;
    eventName = _eventName;
    eventDate = _eventDate;
}

    function buyTicket(string memory tokenURI) public payable {
        require(ticketCount < maxTickets, "All tickets sold");
        require(msg.value >= ticketPrice, "Insufficient ETH sent");

        ticketCount++;
        uint256 newTicketId = ticketCount;
        _safeMint(msg.sender, newTicketId);
        _setTokenURI(newTicketId, tokenURI);
    }

    function withdrawFunds() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
