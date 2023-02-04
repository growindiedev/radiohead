// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "./Escrow.sol";

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";

contract Radiohead is Ownable, ERC1155URIStorage, ERC1155Supply {
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

    mapping(address => uint[]) public songOwners;
    mapping(uint => Song) public songs;
    Song[] public songsArray;
    // we are using regular song Id's to map songs. these are all odd numbers.

    event regularSongBought(uint id, address buyer);
    event limitedSongBought(uint id, address superfan);
    event songCreated(
        uint songId,
        uint ltdSongId,
        address artist,
        uint limitedSupply,
        uint regularPrice,
        uint limitedPrice,
        uint platformRoyality,
        uint superfanRoyality
    );

    constructor(address _escrow) ERC1155("") {
        escrow = Escrow(_escrow);
    }

    function createSong(
        uint _limitedSupply,
        uint _regularSongPrice,
        uint _limitedSongPrice,
        string memory _regularSongURI,
        string memory _limitedSongURI,
        uint _platformRoyality,
        uint _superfanRoyality
    ) external returns (uint songId) {
        require(_limitedSupply > 0, "Limited supply must be greater than 0");
        songIdCounter.increment();
        songId = songIdCounter.current();
        _mint(msg.sender, songId, 10 ** 18, "");
        _setURI(songId, _regularSongURI);
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
        _setURI(ltdSongId, _limitedSongURI);

        currentSong.ltdSongId = ltdSongId;

        songsArray.push(currentSong);
        if (!isApprovedForAll(msg.sender, address(escrow))) {
            setApprovalForAll(address(escrow), true);
        }

        emit songCreated(
            currentSong.songId,
            currentSong.ltdSongId,
            currentSong.artist,
            currentSong.limitedSupply,
            currentSong.regularPrice,
            currentSong.limitedPrice,
            currentSong.platformRoyality,
            currentSong.superfanRoyality
        );
    }

    function buyRegularSong(uint songId) external payable {
        Song storage currentSong;
        if (songId % 2 != 0) {
            require(exists(songId), "the song doesn't exists");
            currentSong = songs[songId];
        } else {
            require(exists(songId - 1), "the song doesn't exists");
            currentSong = songs[songId - 1];
        }
        require(
            exists(currentSong.songId),
            "the songId doesn't exists or not valid"
        );
        require(
            msg.value >= currentSong.regularPrice,
            "Please pay the full amount"
        );
        currentSong.regularRevenue += msg.value;
        escrow.buyRegularSong(
            currentSong.songId,
            payable(address(this)),
            currentSong.artist,
            msg.sender
        );
        songOwners[msg.sender].push(songId);
        emit regularSongBought(songId, msg.sender);
    }

    function buyLimitedSong(uint songId) external payable {
        Song storage currentSong;
        if (songId % 2 != 0) {
            require(exists(songId), "the song doesn't exists");
            currentSong = songs[songId];
        } else {
            require(exists(songId - 1), "the song doesn't exists");
            currentSong = songs[songId - 1];
        }
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
        songOwners[msg.sender].push(currentSong.ltdSongId);
        emit limitedSongBought(currentSong.ltdSongId, msg.sender);
    }

    function withdrawRoyalities() external {
        // uint totalSongs = songIdCounter.current();
        for (uint i = 1; i <= songsArray.length; i += 2) {
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

    function getCurrentSongId() external view returns (uint current) {
        current = songIdCounter.current();
    }

    function getSong(uint id) external view returns (Song memory song) {
        if (id % 2 != 0) {
            require(exists(id), "the song doesn't exists");
            song = songs[id];
        } else {
            require(exists(id - 1), "the song doesn't exists");
            song = songs[id - 1];
        }
    }

    // The following functions are overrides required by Solidity.

    function uri(
        uint256 tokenId
    )
        public
        view
        virtual
        override(ERC1155, ERC1155URIStorage)
        returns (string memory)
    {
        return ERC1155URIStorage.uri(tokenId);
    }

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
