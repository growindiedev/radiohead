// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "./Radiohead.sol";

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
