//SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;

import "./interfaces/IERC721Minter.sol";
import "./interfaces/IERC1155Minter.sol";
import "./interfaces/IMarket.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "hardhat/console.sol";

contract EpikoMarketplace is IMarket,Ownable{
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _itemids;
    Counters.Counter private _itemSold;
    Counters.Counter private _auctionItemIds;
    Counters.Counter private _auctionItemSold;

    IERC20 private omiToken;
    IERC1155Minter private epikoErc1155;
    IERC721Minter private epikoErc721;

    uint256 private _buyTax  = 110;//divide by 100
    uint256 private _sellTax = 110;//divide by 100
    uint256 private constant PERCENTAGE_DENOMINATOR = 10000;
    bytes4 private ERC721InterfaceId = 0x80ac58cd ; // Interface Id of ERC721
    bytes4 private ERC1155InterfaceId = 0xd9b67a26 ; // Interface Id of ERC1155
    bytes4 private royaltyInterfaceId = 0x2a55205a; // interface Id of Royalty
 
    modifier onlySellerOrOwner (address nftAddress, uint256 tokenId, address user, uint256 saleType) {
        if(saleType == 1){
            Sale storage sale = nftSaleItem[nftAddress][tokenId];
            require((sale.seller == msg.sender) || owner() == msg.sender, "Market: Only seller or owner can cancel sell");

        }

        _;
    }
    
    /// @dev mapping from NFT contract to user address to tokenId is item on auction check
    mapping(address =>mapping(address => mapping(uint256 => bool))) private itemIdOnAuction;
    /// @dev mapping from NFT contract to user address to tokenId is item on sale check
    mapping(address => mapping(address => mapping(uint256 => bool))) private itemIdOnSale;
    /// @dev Mapping from Nft contract to tokenId to Auction structure
    mapping(address => mapping(uint256 => Auction)) private nftAuctionItem;
    /// @dev Mapping from Nft contract to tokenId to Sale structure
    mapping(address => mapping(uint256 => Sale)) private nftSaleItem;
    /// @dev Mapping from NFT contract to tokenId to owner to bidders address
    // mapping(address => mapping(uint256 => mapping(address => address[]))) private bidderList;
    mapping(address => mapping(uint256 => address[])) private bidderList;

    /// @dev mapping from NFT conntract to tokenid to bidder address to bid value
    mapping(address => mapping(uint256 => mapping (address => uint256))) private fundsByBidder;
    /// @dev Mapping for royalty fee for artist
    mapping(address => uint256) private _royaltyForArtist;
    /// @dev Mapping for seller balance
    mapping(address => uint256) private _sellerBalance;
    /// @dev mapping from uri to bool
    mapping(string => bool) private _isUriExist;

    mapping(address => mapping(uint256 => Bid[])) bidAndValue;

    constructor(address ERC721Address, address ERC1155Address, address ERC20Address){
        require(ERC721Address != address(0), "ERC721: address Zero provided");
        require(ERC1155Address != address(0), "ERC1155: address Zero provided");
        require(ERC20Address != address(0), "ERC20: address Zero provided");

        epikoErc721 = IERC721Minter(ERC721Address);
        epikoErc1155 = IERC1155Minter(ERC1155Address);
        omiToken = IERC20(ERC20Address);
    }

    /* Mint nft */
    function mint(
        uint256 amount, 
        uint256 royaltyFraction, 
        string memory uri, 
        bool isErc721
        ) external {
        require(amount > 0, "Market: amount zero provided");
        require(royaltyFraction <= 10000, "Market: invalid royaltyFraction provided");
        require(_isUriExist[uri] != true, "Market: uri already exist");

        address _user = msg.sender;
        if (isErc721) {
            require(amount == 1, "Market: amount must be 1");
            (uint256 id) = epikoErc721.mint(_user, royaltyFraction, uri);
            emit Mint(address(0), _user, id);

        }else{
            require(amount > 0, "Market: amount must greater than 0");

            uint256 id = epikoErc1155.mint(_user, amount, royaltyFraction, uri, "0x00");
            emit Mint(address(0), _user, id);
        }
        _isUriExist[uri] = true;
    }
    
    /* Burn nft (only contract Owner)*/
    function burn(
        uint256 tokenId
        ) external onlyOwner {
        require(tokenId > 0, "Market: Not valid tokenId");

        epikoErc721.burn(tokenId);
        // delete _isUriExist[]
    }

    /* Burn nft (only contract Owner)*/
    function burn(
        address from, 
        uint256 tokenId, 
        uint256 amount
        ) external onlyOwner {
        require(tokenId > 0, "Not valid tokenId");

        epikoErc1155.burn(from, tokenId, amount);
    }

    /* Places item for sale on the marketplace */
    function sellitem(
        address nftAddress,
        uint256 tokenId, 
        uint256 amount, 
        uint256 price
        ) external {
        require(nftAddress != address(0), "Market: Address zero provided");
        require(tokenId > 0, "Market: Not Valid NFT id");
        require(amount > 0, "Market: Not Valid Quantity");
        require(price > 0,"Market: Price must be greater than 0");
        require(!itemIdOnSale[nftAddress][msg.sender][tokenId],"Market: Nft already on Sale");
        require(!itemIdOnAuction[nftAddress][msg.sender][tokenId],"Market: Nft already on Auction");

        address seller = msg.sender;
        
        _itemids.increment();

        // Sale storage sale = nftSaleItem[nftAddress][tokenId];
        
        if(IERC721Minter(nftAddress).supportsInterface(ERC721InterfaceId)){           
            require(IERC721(nftAddress).getApproved(tokenId) == address(this),"Market: NFT not approved for auction");
            
            _addItemtoSell(nftAddress, tokenId, price, 1 , seller);

            // _sellerAddress[tokenId] = msg.sender;

        } else if(IERC1155Minter(nftAddress).supportsInterface(ERC1155InterfaceId)){
            require(IERC1155(nftAddress).isApprovedForAll(msg.sender,address(this)), "Market: NFT not approved for auction");
              
            _addItemtoSell(nftAddress, tokenId, price, amount, seller);

            // _sellerAddress[tokenId] = msg.sender;
    
        }else{
            revert("Market: NFT Contract Not Supported");
        }

        itemIdOnSale[nftAddress][msg.sender][tokenId] = true;
        
        emit MarketItemCreated(nftAddress, seller, price, tokenId);

    }

    /* Place buy order for Multiple item on marketplace */
    function buyItem(
        address nftAddress,
        uint256 tokenId,
        uint256 quantity
        ) external {
        Sale storage sale = nftSaleItem[nftAddress][tokenId];
        
        require(nftAddress != address(0), "Market: Address zero provided");
        require(tokenId > 0, "Market: Not Valid NFT id");
        require(quantity > 0, "Market: Not Valid Quantity");
        require (itemIdOnSale[nftAddress][sale.seller][tokenId], "Market: NFT not on sell");
        
        address buyer = msg.sender;

        // ItemForSellOrForAuction storage sellItem = _itemOnSellAuction[tokenId][seller];
        
        if(IERC721(nftAddress).supportsInterface(ERC721InterfaceId)){

         
            uint256 totalNftValue = sale.price.mul(quantity);

            if(!IERC721(nftAddress).supportsInterface(royaltyInterfaceId)){

                _transferTokens(totalNftValue, 0, sale.seller, buyer, address(0));
                IERC721(nftAddress).transferFrom(sale.seller, buyer, sale.tokenId);
            }else{

                (address user, uint256 royaltyAmount) = IERC2981(nftAddress).royaltyInfo(sale.tokenId, totalNftValue);
                console.log(user,royaltyAmount);
                _transferTokens(totalNftValue, royaltyAmount, sale.seller, buyer, user);
                IERC721(nftAddress).transferFrom (sale.seller, buyer, sale.tokenId);
            }
            

            sale.sold = true;
            itemIdOnSale[nftAddress][msg.sender][tokenId] = false;
            delete nftSaleItem[nftAddress][tokenId];
            // sellItem.onSell = false;
            
            emit Buy(sale.seller, buyer, quantity, tokenId);

        }else if(IERC1155Minter(nftAddress).supportsInterface(ERC1155InterfaceId)){
            
            uint256 totalNftValue = sale.price.mul(quantity);

            if(!IERC1155(nftAddress).supportsInterface(royaltyInterfaceId)){

                _transferTokens(totalNftValue, 0, sale.seller, buyer, address(0));
                IERC1155(nftAddress).safeTransferFrom(sale.seller, buyer, sale.tokenId, quantity,"");
                sale.quantity -= quantity;

            }
            else{
                (address user, uint256 royaltyAmount) = IERC2981(nftAddress).royaltyInfo(sale.tokenId, totalNftValue);
                _transferTokens(totalNftValue, royaltyAmount, sale.seller, buyer, user);
                IERC1155(nftAddress).safeTransferFrom(sale.seller, buyer, sale.tokenId, quantity,"");
            }

            if(sale.quantity == 0){
                sale.sold = true;
                itemIdOnSale[nftAddress][msg.sender][tokenId] = false;
                delete nftSaleItem[nftAddress][tokenId];
            }
            // sellItem.onSell = false;
            
            emit Buy(sale.seller, buyer, quantity, tokenId);

        }else{
            revert("Market: Token not exist");
        }

        _itemSold.increment();
    }

    /* Create Auction for item on marketplace */
    function createAuction(
        address nftAddress,
        uint256 tokenId, 
        uint256 amount, 
        uint256 basePrice, 
        uint256 endTime
        ) external {
        require(nftAddress != address(0), "Market: Address zero provided");
        require(tokenId > 0, "Market: Not Valid NFT id");
        require(amount > 0, "Market: Not Valid Quantity");
        require(!itemIdOnSale[nftAddress][msg.sender][tokenId], "Market: NFT already on sale");
        require(!itemIdOnAuction[nftAddress][msg.sender][tokenId], "Market: NFT already on auction");
        require(basePrice > 0 ,"Market: BasePrice must be greater than 0");
        require(endTime > block.timestamp, "Market: endtime must be greater then current time");

        address seller = msg.sender;
        uint256 startTime = block.timestamp;
        
        Auction storage auction = nftAuctionItem[nftAddress][tokenId];
        
        if(IERC721(nftAddress).supportsInterface(ERC721InterfaceId)) {

            require(!auction.sold, "Market: Already on sell");
            require(IERC721(nftAddress).getApproved(tokenId) == address(this),"Market: NFT not approved for auction");
        
            _addItemtoAuction(nftAddress, tokenId, amount, basePrice, startTime, endTime, seller);

            // _sellerAddress[tokenId] = msg.sender;

        }else if(IERC1155(nftAddress).supportsInterface(ERC1155InterfaceId)){

            require(!auction.sold, "Market: Already on sell");
            require(IERC1155(nftAddress).isApprovedForAll(msg.sender,address(this)), "Market: NFT not approved for auction");
        
            _addItemtoAuction(nftAddress, tokenId, amount, basePrice, startTime, endTime, seller);

            // _sellerAddress[tokenId] = msg.sender;

        }else{
            revert("Market: Token not Exist");
        }

        emit AuctionCreated(nftAddress,tokenId, seller, basePrice, startTime, endTime);

    }

    /* Place bid for item  on marketplace */
    function placeBid(
        address nftAddress,
        uint256 tokenId, 
        uint256 price
        ) external {
        
        Auction storage auction = nftAuctionItem[nftAddress][tokenId];
        require(nftAddress != address(0), "Market: Address zero provided");
        require(tokenId > 0, "Market: Not Valid NFT id");
        require(itemIdOnAuction[nftAddress][auction.seller][tokenId], "Market: NFt not on Auction");
        require(auction.endTime > block.timestamp, "Market: Auction ended");
        require(auction.startTime < block.timestamp, "Market: Auction not started");
        require(price >= auction.basePrice && price > auction.highestBid.bid, "Market: palce highest bid");
        require(auction.seller != msg.sender, "Market: seller not allowed");
        require(omiToken.allowance(msg.sender, address(this)) >= price, "Market: please proivde asking price");
           
        // if(auction.highestBid.bid > 0) {
        //     omiToken.transfer(auction.highestBid.bidder, auction.highestBid.bid);
        // }

        omiToken.transferFrom(msg.sender,address(this), price);   
        auction.highestBid.bid = price;
        auction.highestBid.bidder = msg.sender;         
        fundsByBidder[nftAddress][tokenId][msg.sender] = price;
        bidAndValue[nftAddress][tokenId].push(Bid(msg.sender,price));
        // auction.bidders.push(currentBidder);
         
        emit PlaceBid(nftAddress, msg.sender, price);
        
    }
    
    //TODO fix royalty distribution
    /* To Approve bid*/
    function approveBid(
        address nftAddress,
        uint256 tokenId, 
        address bidder
        ) external{
        Auction storage auction = nftAuctionItem[nftAddress][tokenId];
        require(nftAddress != address(0), "Market: Address zero provided");
        require(tokenId > 0, "Market: Not Valid NFT id");
        require(itemIdOnAuction[nftAddress][auction.seller][tokenId], "Market: NFt not on Auction");
        require(bidder != address(0), "Market: Please enter valid address");
        require(fundsByBidder[nftAddress][tokenId][bidder] !=0, "Market: bidder not found");
        require(auction.endTime > block.timestamp, "Market: Auction ended");
        require(auction.startTime < block.timestamp, "Market: Auction not started");
        
        uint256 bidderValue = fundsByBidder[nftAddress][tokenId][bidder];
        
        if(IERC721(nftAddress).supportsInterface(ERC721InterfaceId)){

            require(auction.seller == msg.sender, "Market: not authorised");
            require(auction.tokenId == tokenId, "Market: Auction not found");

            if(!IERC721(nftAddress).supportsInterface(royaltyInterfaceId)){
                _approveBid(bidderValue, 0, auction.seller, address(0), tokenId, nftAddress, bidder);
                IERC721(nftAddress).transferFrom(auction.seller, bidder, auction.tokenId);

            }else{
                (address user,uint256 amount) = IERC2981(nftAddress).royaltyInfo(auction.tokenId, bidderValue);

                _approveBid(bidderValue, amount, auction.seller, user, tokenId, nftAddress, bidder);
                IERC721(nftAddress).transferFrom(auction.seller, bidder, auction.tokenId);
            }

            auction.sold = true;
            itemIdOnAuction[nftAddress][auction.seller][tokenId];
            _auctionItemSold.increment();

            emit ApproveBid(auction.seller, bidder, bidderValue, tokenId);

            delete nftAuctionItem[nftAddress][tokenId];

        } else if(IERC1155(nftAddress).supportsInterface(ERC1155InterfaceId)){

            require(auction.seller == msg.sender, "Market: not authorised");
            require(auction.tokenId == tokenId, "Market: Auction not found");

            if(!IERC721(nftAddress).supportsInterface(royaltyInterfaceId)){
                _approveBid(bidderValue, 0, auction.seller, address(0), tokenId, nftAddress, bidder);
                IERC1155(nftAddress).safeTransferFrom(auction.seller, bidder, auction.tokenId, auction.quantity, "");
            }else{

                (address user,uint256 amount) = IERC2981(nftAddress).royaltyInfo(auction.tokenId, bidderValue);
                _approveBid(bidderValue, amount, auction.seller, user, tokenId, nftAddress, bidder);
                IERC1155(nftAddress).safeTransferFrom(auction.seller, bidder, auction.tokenId, auction.quantity, "");
            }

            auction.sold = true;
            _auctionItemSold.increment();

            emit ApproveBid(auction.seller, bidder, bidderValue, tokenId);

            delete nftAuctionItem[nftAddress][tokenId];

        } else {
            revert ("Market: NFT not supported");
        }
    }

    /* To cancel Auction */
    function cancelAuction(
        address nftAddress,
        uint256 tokenId
        ) external onlySellerOrOwner(nftAddress,tokenId, msg.sender, 2) {

        Auction storage auction = nftAuctionItem[nftAddress][tokenId];

        require(tokenId > 0, "Market: not valid id");
        require(itemIdOnAuction[nftAddress][msg.sender][tokenId],"Market: NFT not on auction");
        require(auction.endTime > block.timestamp, "Market: Auction ended");
        require(!auction.sold, "Market: Already sold");

        if(auction.highestBid.bid > 0){
            omiToken.transfer(auction.highestBid.bidder, auction.highestBid.bid);
        }
        delete nftAuctionItem[nftAddress][tokenId];
        itemIdOnAuction[nftAddress][msg.sender][tokenId] = false;
    }

    /* To cancel sell */
    function cancelSell(
        address nftAddress,
        uint256 tokenId
        ) external onlySellerOrOwner (nftAddress, tokenId, msg.sender, 1) {
        require(tokenId > 0, "Market: not valid id");
        require(itemIdOnSale[nftAddress][msg.sender][tokenId],"Market: NFT not on sale");
        require(!nftSaleItem[nftAddress][tokenId].sold, "Market: NFT Sold");
        
        delete nftSaleItem[nftAddress][tokenId];
        itemIdOnSale[nftAddress][msg.sender][tokenId] = false;
    }

    /* To cancel auction bid */
    function cancelBid(
        address nftAddress,
        uint256 tokenId
        ) external {
        require(tokenId > 0, "Market: not valid id");
        require(nftAuctionItem[nftAddress][tokenId].endTime > block.timestamp, "Market: Auction ended");
        require(fundsByBidder[nftAddress][tokenId][msg.sender] > 0, "Market: not bided on auction");

        // delete bidAndValue[nftAddress][tokenId];

        removeBid(nftAddress, tokenId, msg.sender);
    }

    /* To check list of bidder */
    //TODO return all bidders address
    function checkBidderList(
        address nftAddress,
        uint256 tokenId
        ) external view returns (Bid[] memory bid){
        require (tokenId > 0, "Market: not valid id");

        return bidAndValue[nftAddress][tokenId];

    }

    //TODO return all available item on market
    // function listOFItemOnMarket(
    //     uint256 tokenId
    //     ) 
    //     external view returns
    //     (
    //         uint256 _id, 
    //         uint256 _startTime, 
    //         uint256 _endTime,
    //         uint256 _price, 
    //         uint256 _quantity,
    //         uint256 _time, 
    //         address _seller, 
    //         bool _cancelled, 
    //         bool _sold,
    //         bool _onSell, 
    //         bool _onAuction
    //     )
    //  {
    //     require (tokenId > 0, "Market: tokenId not valid");
        
    //     address seller = _sellerAddress[tokenId];
    //     require (seller != address(0), "Market: seller not found");

    //     ItemForSellOrForAuction memory item = _itemOnSellAuction[tokenId][seller];
        
    //     _id = item.tokenId;
    //     _startTime =  item.startTime;
    //     _endTime = item.endTime;
    //     _price = item.basePrice;
    //     _quantity = item.amount;
    //     _time = item.time;
    //     _seller = item.seller;
    //     _cancelled = item.cancelled;
    //     _sold = item.sold;
    //     _onSell = item.onSell;
    //     _onAuction = item.onAuction;    
    // }

    /* To Withdraw roaylty amount (only Creator) */
    function withdrawRoyaltyPoint(
        uint256 amount
        ) external{
        require(_royaltyForArtist[msg.sender]!=0, "Market: Not Enough balance to withdtraw");
        require(amount <= _royaltyForArtist[msg.sender], "Market: Amount exceed total royalty Point");

        omiToken.transfer(msg.sender, amount);
        _royaltyForArtist[msg.sender] -= amount;
    }

    /* To transfer nfts from `from` to `to` */
    function transfer(
        address from, 
        address to, 
        uint256 tokenId, 
        uint256 amount
        ) external {
        require(to != address(0), "Market: Transfer to zero address");
        require(from != address(0), "Market: Transfer from zero address");
        require(tokenId > 0, "Market: Not valid tokenId");
    
        if(epikoErc721._isExist(tokenId)){
            epikoErc721.transferFrom(from, to, tokenId);
        
        }else if(epikoErc1155._isExist(tokenId)){
            epikoErc1155.safeTransferFrom(from, to, tokenId, amount,"");
        }
    }

    function fetchNftOwner(
        uint256 tokenId
        ) external view returns(address owner){
        require(tokenId > 0, "Market: Not valid tokenId");
        if(epikoErc721._isExist(tokenId)){
            return epikoErc721.ownerOf(tokenId);
        }else{
            revert("Market: tokenId not exist");
        }
    }

    /* owner can set selltax(fees) */
    function setSellTax(
        uint256 percentage
        ) external onlyOwner{
        require(percentage >= 10000, "Market: percentage must be less than 100");
        _sellTax = percentage;
    }

    /* owner can set buytax(fees) */
    function setBuyTax(
        uint256 percentage
        ) external onlyOwner{
        require(percentage >= 10000, "Market: percentage must be less than 100");
        _buyTax = percentage;
    }

    function _transferTokens(
        uint256 price, 
        uint256 royaltyAmount, 
        address _seller, 
        address _buyer, 
        address royaltyReceiver
        ) private {
        uint256 amountForOwner;
        // uint256 buyingValue = price.add(price.mul(_sellTax)).div(PERCENTAGE_DENOMINATOR);
        uint256 buyingValue = price + (price*_sellTax) / PERCENTAGE_DENOMINATOR;
        console.log(buyingValue);

        require(omiToken.allowance(_buyer,address(this)) >= buyingValue, "Market: please proivde asking price");
        
        uint256 amountForSeller = price - (price*_buyTax) / PERCENTAGE_DENOMINATOR;
        // uint256 amountForSeller = price.sub(price.mul(_buyTax)).div(PERCENTAGE_DENOMINATOR);
        
        amountForOwner = buyingValue - amountForSeller;
        
        omiToken.transferFrom(msg.sender,address(this), buyingValue);
        omiToken.transfer(owner(), amountForOwner);
        omiToken.transfer(_seller, amountForSeller);

        if(royaltyReceiver != address(0)){
            _royaltyForArtist[royaltyReceiver] += royaltyAmount;
        }
    }

    function _approveBid(
        uint256 price, 
        uint256 _amount, 
        address _seller, 
        address royaltyReceiver,
        uint256 tokenId,
        address nftAddress,
        address _bidder
        ) private {
        
        uint256 amountForOwner;
        uint256 amountForSeller = price - ((price * (_buyTax + _sellTax))/ PERCENTAGE_DENOMINATOR);
        // uint256 amountForSeller = price.sub(price.mul(_buyTax.add(_sellTax))).div(PERCENTAGE_DENOMINATOR);

        amountForOwner = price - amountForSeller;
        amountForSeller = amountForSeller.sub(_amount);

        omiToken.transfer(owner(), amountForOwner);
        omiToken.transfer(_seller, amountForSeller);

        if(royaltyReceiver != address(0)){
            _royaltyForArtist[royaltyReceiver] += _amount;
        }
        
        for(uint256 index = 0; index < bidAndValue[nftAddress][tokenId].length; index++){
            if(bidAndValue[nftAddress][tokenId][index].bidder != _bidder){
                omiToken.transfer(bidAndValue[nftAddress][tokenId][index].bidder, bidAndValue[nftAddress][tokenId][index].bid);
            }
        }        
    }

    function removeBid(address nftAddress, uint256 tokenId, address _bidder) internal {
        
        for (
            uint256 index = 0;
            index < bidAndValue[nftAddress][tokenId].length;
            index++
        ) {
            if (bidAndValue[nftAddress][tokenId][index].bidder == _bidder) {

                omiToken.transfer(_bidder, fundsByBidder[nftAddress][tokenId][_bidder]);
                delete bidAndValue[nftAddress][tokenId][index];
                bidAndValue[nftAddress][tokenId][index] = bidAndValue[nftAddress][tokenId][bidAndValue[nftAddress][tokenId].length - 1];
                console.log(index);
                bidAndValue[nftAddress][tokenId].pop();
                break;
            }
        }
    }

    function _addItemtoAuction(
        address nftAddress,
        uint256 tokenId, 
        uint256 _amount, 
        uint256 basePrice, 
        uint256 startTime, 
        uint256 endTime, 
        address _seller
        ) private {
        _auctionItemIds.increment();

        // ItemForSellOrForAuction storage auction = _itemOnSellAuction[tokenId][_seller];
        Auction storage auction = nftAuctionItem[nftAddress][tokenId];

        auction.tokenId = tokenId;
        auction.basePrice = basePrice;
        auction.seller = _seller;
        auction.quantity = _amount;
        auction.time = block.timestamp;
        auction.startTime = startTime;
        auction.endTime = endTime;

        itemIdOnAuction[nftAddress][msg.sender][tokenId] = true;
    }

    function _addItemtoSell(
        address nftAddress,
        uint256 tokenId, 
        uint256 price, 
        uint256 quantity, 
        address _seller
        ) private {

        // ItemForSellOrForAuction storage sell = _itemOnSellAuction[tokenId][_seller];
        Sale storage sale = nftSaleItem[nftAddress][tokenId];

        sale.tokenId = tokenId;
        sale.price = price;
        sale.seller = _seller;
        sale.quantity = quantity;
        sale.time = block.timestamp;

        itemIdOnSale[nftAddress][msg.sender][tokenId] = true;
        
    }

    // function _cancelSell(
    //     Sale memory sale, 
    //     uint256 tokenId
    //     ) private pure{

    //     require(sale.tokenId == tokenId, "Market: sell not found");
    //     require(sale.sold == false, "Market: already sold");

    // }

    function checkRoyalty(
        address user
        ) public view returns (uint256) {
        require(user != address(0), "Market: address zero provided");

        return _royaltyForArtist[user];
    } 

    function revokeAuction(address nftAddress, uint256 tokenId) external {
        require(nftAddress != address(0), "Market: Address zero provided");
        require(tokenId > 0, "Market: Not valid Token Id");
        require(itemIdOnAuction[nftAddress][msg.sender][tokenId], "Market: NFT not on auction");

        itemIdOnAuction[nftAddress][msg.sender][tokenId] = false;
    }
    
}
