//SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;

interface IMarket{

    struct Sale {
        uint256 itemId;
        uint256 tokenId;
        uint256 price;
        uint256 quantity;
        uint256 time;
        address nftContract;
        address buyer;
        address seller;
        bool sold;
    }

    struct Auction {
        uint256 itemId;
        uint256 tokenId;
        uint256 startTime;
        uint256 endTime;
        uint256 basePrice;
        uint256 quantity;
        uint256 time;
        address seller;
        address nftContract;
        bool sold;
        Bid highestBid;
    }

    struct Bid {
        address bidder;
        uint256 bid;
    }

    event Mint(address from, address to, uint256 indexed tokenId);
    event PlaceBid(address nftAddress, address bidder, uint256 price);
    event Buy(address seller, address buyer,uint256 quantity, uint256 tokenId);
    event MarketItemCreated(address nftAddress, address seller, uint256 price, uint256 tokenId);
    event ApproveBid(address seller, address bidder, uint256 price, uint256 tokenId);
    event AuctionCreated(address nftAddress, uint256 tokenId, address seller, uint256 price, uint256 startTime, uint256 endTime);
}