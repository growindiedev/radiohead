const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { parseEther } = require("ethers/lib/utils");

// Record 721
// • should deploy (638ms)
// Record 1155
// + should deploy (75ms)
// Jukebox
// constructor()
// r should deploy (80ms)
// press__721()
// r should press Record_721 clones (79ms)
// r record clones should only allow owner to mint (45ms)
// press_1155()
// should press Record 1155 clones (46ms)
// record clones should only allow owner to mint pressRecord ()
// • should press records (94ms)
// + should add pressed records to the catalog getCatalog ()
// • should return a catalog of records recordIndex ()
// should locate records in the catalog (87ms)
// mintRecord ()
// • should mint limited edition records (59ms)
// • should mint standard issue records (49ms)
// • should store jukebox revenue on the contract
// • should track revenue earned on a per record basis
// distributeRevenue()
// should distribute revenue to artists, charities, and ltd. minters (52ms)

describe("Deploy radiohead and  contract", function () {
  async function deployRadioheadFixture() {
    const [owner, artist1, artist2] = await ethers.getSigners();
    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy();
    console.log("escrow", escrow.address);

    const Radiohead = await ethers.getContractFactory("Radiohead");
    const radiohead = await Radiohead.deploy(escrow.address);
    console.log("radiohead", radiohead.address);

    // Fixtures can return anything you consider useful for your tests
    return { escrow, radiohead, owner, artist1, artist2 };
  }

  it("artist can  create a song", async function () {
    const { radiohead, owner, artist1 } = await loadFixture(
      deployRadioheadFixture
    );
    await radiohead
      .connect(artist1)
      .createSong(
        15,
        parseEther("0.1"),
        parseEther("0.5"),
        "regular1",
        "limited1",
        5,
        20
      );
    expect(await radiohead.exists((await radiohead.getCurrentSongId()) - 1)).to
      .be.true;
  });
});
