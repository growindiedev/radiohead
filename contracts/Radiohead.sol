// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "./Escrow.sol";

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Radiohead is ERC1155, Ownable, ERC1155Supply {
    using Counters for Counters.Counter;
    Counters.Counter private songIdCounter;
    Escrow private escrow;

    // A single song will have two songIds, one belongs to unlimited edition and anoter one belongs to limited ones

    struct Song {
        address artist;
        uint songId;
        uint ltdSongId;
        uint limitedSupply;
        uint limitedSongMinted;
        uint regularPrice;
        uint limitedPrice;
        uint regularRevenue;
        uint ltdRevenue;
        uint platformRoyality;
        uint superfanRoyality;
        address[] superfans;
    }

    mapping(uint => Song) public songs;

    // we are using regular song Id's to map songs. these are all odd numbers.

    constructor(address _escrow) ERC1155("") {
        songIdCounter.increment();
        escrow = Escrow(_escrow);
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function createSong(
        uint _limitedSupply,
        uint _regularSongPrice,
        uint _limitedSongPrice,
        uint _platformRoyality,
        uint _superfanRoyality
    ) external {
        require(_limitedSupply > 0, "Limited supply must be greater than 0");
        uint songId = songIdCounter.current();
        _mint(msg.sender, songId, 10 ** 18, "");

        Song storage currentSong = songs[songId];
        currentSong.artist = msg.sender;
        currentSong.songId = songId;
        currentSong.limitedSupply = _limitedSupply;
        currentSong.regularPrice = _regularSongPrice;
        currentSong.limitedPrice = _limitedSongPrice;
        currentSong.platformRoyality = _platformRoyality;
        currentSong.superfanRoyality = _superfanRoyality;

        songIdCounter.increment();

        uint ltdSongId = songIdCounter.current();
        _mint(msg.sender, ltdSongId, _limitedSupply, "");

        currentSong.ltdSongId = ltdSongId;

        songIdCounter.increment();
        if (!isApprovedForAll(msg.sender, address(escrow))) {
            setApprovalForAll(address(escrow), true);
        }
    }

    function buyRegularSong(uint songId) external payable {
        Song storage currentSong = songs[songId];
        require(exists(songId), "the songId doesn't exists or not valid");
        require(
            msg.value >= currentSong.regularPrice,
            "Please pay the full amount"
        );
        currentSong.regularRevenue += msg.value;
        escrow.buyRegularSong(
            songId,
            payable(address(this)),
            currentSong.artist,
            msg.sender
        );
    }

    function buyLimitedSong(uint songId) external payable {
        Song storage currentSong = songs[songId];
        require(
            exists(currentSong.ltdSongId),
            "the songId doesn't exists or not valid"
        );
        require(currentSong.limitedSongMinted < currentSong.limitedSupply, "");
        require(
            msg.value >= currentSong.limitedPrice,
            "Please pay the full amount"
        );
        currentSong.limitedSongMinted += 1;
        currentSong.ltdRevenue += msg.value;
        currentSong.superfans.push(msg.sender);
        escrow.buyRegularSong(
            currentSong.ltdSongId,
            payable(address(this)),
            currentSong.artist,
            msg.sender
        );
    }

    function withdrawRoyalities() external {
        uint totalSongs = songIdCounter.current();
        for (uint i = 1; i <= totalSongs; i += 2) {
            Song storage currentSong = songs[i];
            require(exists(i), "the song doesnt exists");

            // for regular songs
            uint platformRevenueRegular = (currentSong.regularRevenue / 100) *
                currentSong.platformRoyality;
            uint artistRevenueRegular = currentSong.regularRevenue -
                platformRevenueRegular;

            // for limited songs
            uint platformRevenueLtd = (currentSong.ltdRevenue / 100) *
                currentSong.platformRoyality;
            uint artistRevenueLtd = currentSong.ltdRevenue - platformRevenueLtd;

            //calculate the limited edition songs to superfans
            address[] memory superfans = currentSong.superfans;
            uint microRevenue = ((currentSong.regularRevenue / 100) *
                currentSong.superfanRoyality) / currentSong.limitedSupply;
            uint superfanRevenue = microRevenue * superfans.length;

            // total artist revenue
            uint artistRevenue = artistRevenueRegular +
                artistRevenueLtd -
                superfanRevenue;

            // reset the revenue balance on the song to reflect the distribution
            currentSong.regularRevenue = 0;
            currentSong.ltdRevenue = 0;

            //distribute revenue to the artist
            (bool sentArtist, ) = payable(currentSong.artist).call{
                value: artistRevenue
            }("");
            require(sentArtist, "failed to disribute royalities to the artist");

            //revenue for the platform will stay in the contract

            //distribute revenue to the superfans
            for (uint j = 0; j < superfans.length; j++) {
                address payable superfan = payable(superfans[i]);
                (bool sentMicro, ) = superfan.call{value: microRevenue}("");
                require(
                    sentMicro,
                    "failed to disribute royalities to the superfan"
                );
            }
        }
        // iterate a loop till songIdCounter.current(), regular song id's are always odd so keep that in mind
        //go through every song in songs mapping
        // check if the song exists and if the current song is limited or reguar
        //calculate royalities per song for different parties
        //distribute royalities to different parties
        // reset all revenues
    }

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
