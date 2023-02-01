// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Escrow {
    function buyRegularSong(
        uint songId,
        address payable _radio,
        address artist,
        address to
    ) external {
        Radiohead(_radio).safeTransferFrom(artist, to, songId, 1, "");
    }

    function buyLimitedSong(
        uint ltdSongId,
        address payable _radio,
        address artist,
        address to
    ) external {
        Radiohead(_radio).safeTransferFrom(artist, to, ltdSongId, 1, "");
    }
}

contract Radiohead is ERC1155, Ownable, ERC1155Supply {
    using Counters for Counters.Counter;
    Counters.Counter private _songIdCounter;
    address private _owner;
    Escrow private escrow;

    // A single song will have two songIds, one belongs to unlimited edition and anoter one belongs to limited ones

    struct Song {
        address artist;
        uint songId;
        uint ltdSongId;
        uint256 limitedSupply;
        uint regularPrice;
        uint limitedPrice;
    }

    mapping(uint => Song) public songs; // we are using regular song Id's to map songs. these are all odd numbers.

    constructor(address _escrow) ERC1155("") {
        _songIdCounter.increment();
        _owner = msg.sender;
        escrow = Escrow(_escrow);
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function createSong(
        uint _limitedSupply,
        uint _regularSongPrice,
        uint _limitedSongPrice
    ) external {
        require(_limitedSupply > 0, "Limited supply must be greater than 0");
        uint songId = _songIdCounter.current();
        _mint(msg.sender, songId, 10 ** 18, "");

        Song storage currentSong = songs[songId];
        currentSong.artist = msg.sender;
        currentSong.songId = songId;
        currentSong.limitedSupply = _limitedSupply;
        currentSong.regularPrice = _regularSongPrice;
        currentSong.limitedPrice = _limitedSongPrice;

        _songIdCounter.increment();

        uint ltdSongId = _songIdCounter.current();
        _mint(msg.sender, ltdSongId, _limitedSupply, "");

        currentSong.ltdSongId = ltdSongId;

        _songIdCounter.increment();
        if (!isApprovedForAll(msg.sender, address(escrow))) {
            setApprovalForAll(address(escrow), true);
        }
    }

    function buyRegularSong(uint songId) external {
        //safeTransferFrom(address(this), msg.sender, songId, 1, "");
        escrow.buyRegularSong(
            songId,
            payable(address(this)),
            songs[songId].artist,
            msg.sender
        );
    }

    function buyLimitedSong(uint songId) external {
        uint ltdSongId = songs[songId].ltdSongId;
        escrow.buyRegularSong(
            ltdSongId,
            payable(address(this)),
            songs[songId].artist,
            msg.sender
        );
    }

    // function transfer(address to, uint songId, uint amount, string memory class) external {
    //     safeTransferFrom(msg.sender, to, songId, amount, bytes(class));
    // }

    // function listSong() external {

    // }

    // function buySong() external {

    // }

    // function withdraw() external {

    // }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    receive() external payable {}
}
