const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { parseEther, formatEther } = require("ethers/lib/utils");
const { json } = require("hardhat/internal/core/params/argumentTypes");

const deployRadioheadFixture = async () => {
	const [
		owner,
		artist1,
		artist2,
		regularBuyer,
		superFan,
		regularBuyer2,
		superFan2,
	] = await ethers.getSigners();
	const Escrow = await ethers.getContractFactory("Escrow");
	const escrow = await Escrow.deploy();

	const Radiohead = await ethers.getContractFactory("Radiohead");
	const radiohead = await Radiohead.deploy(escrow.address);

	await radiohead
		.connect(artist1)
		.createSong(15, parseEther("1"), parseEther("5"), "uri", 5, 20);

	return {
		escrow,
		radiohead,
		owner,
		artist1,
		artist2,
		regularBuyer,
		superFan,
		regularBuyer2,
		superFan2,
	};
};

const deployWithdrawFixture = async () => {
	// Compare two BigNumbers that are close to one another.
	//
	// This is useful for when you want to compare the balance of an address after
	// it executes a transaction, and you don't want to worry about accounting for
	// balances changes due to paying for gas a.k.a. transaction fees.

	const closeTo = async (a, b, margin) => {
		expect(a).to.be.closeTo(b, margin);
	};
	const [
		owner,
		artist1,
		artist2,
		regularBuyer1,
		superFan1,
		regularBuyer2,
		superFan2,
	] = await ethers.getSigners();

	const Escrow = await ethers.getContractFactory("Escrow");
	const escrow = await Escrow.deploy();

	const Radiohead = await ethers.getContractFactory("Radiohead");
	const radiohead = await Radiohead.deploy(escrow.address);

	await radiohead
		.connect(artist1)
		.createSong(6, parseEther("2"), parseEther("5"), "uri", 5, 20);

	await radiohead
		.connect(artist2)
		.createSong(3, parseEther("3"), parseEther("7"), "uri", 4, 17);

	await radiohead
		.connect(regularBuyer1)
		.buyRegularSong(1, { value: parseEther("2") });

	await radiohead
		.connect(regularBuyer1)
		.buyRegularSong(1, { value: parseEther("2") });

	await radiohead
		.connect(superFan1)
		.buyLimitedSong(1, { value: parseEther("5") });

	await radiohead
		.connect(regularBuyer2)
		.buyRegularSong(3, { value: parseEther("3") });

	await radiohead
		.connect(regularBuyer2)
		.buyRegularSong(3, { value: parseEther("3") });

	await radiohead
		.connect(superFan1)
		.buyLimitedSong(3, { value: parseEther("7") });

	await radiohead
		.connect(superFan1)
		.buyLimitedSong(3, { value: parseEther("7") });

	await radiohead
		.connect(superFan2)
		.buyLimitedSong(3, { value: parseEther("7") });

	const calcSongs = (songsCreated) => {
		let platformRevenueTotal = 0;
		let artistRevenueTotal = 0;
		let superfanRevenueTotal = 0;

		for (let i = 0; i < songsCreated.length; i++) {
			const currentSong = songsCreated[i];
			// for regular songs
			const platformRevenueRegular =
				(currentSong.regularRevenue / 100) * currentSong.platformRoyality;
			const artistRevenueRegular =
				currentSong.regularRevenue - platformRevenueRegular;

			// for limited songs
			const platformRevenueLtd =
				(currentSong.ltdRevenue / 100) * currentSong.platformRoyality;
			const artistRevenueLtd = currentSong.ltdRevenue - platformRevenueLtd;

			//calculate the limited edition songs to superfans
			const superfans = currentSong.superfans;
			const microRevenue =
				((currentSong.regularRevenue / 100) * currentSong.superfanRoyality) /
				currentSong.limitedSupply;
			const superfanRevenue = microRevenue * superfans.length;

			// total artist revenue
			const artistRevenue =
				artistRevenueRegular + artistRevenueLtd - superfanRevenue;

			artistRevenueTotal += artistRevenue;
			superfanRevenueTotal += superfanRevenue;
			platformRevenueTotal += platformRevenueRegular + platformRevenueLtd;
		}
		return {
			platformRevenueTotal,
			artistRevenueTotal,
			superfanRevenueTotal,
		};
	};

	return {
		escrow,
		radiohead,
		owner,
		artist1,
		artist2,
		regularBuyer1,
		superFan1,
		regularBuyer2,
		superFan2,
		calcSongs,
		closeTo,
	};
};

describe("Deployment", function () {
	it("Can deploy Escrow and Radiohead contract", async () => {
		const Escrow = await ethers.getContractFactory("Escrow");
		const escrow = await Escrow.deploy();
		const Radiohead = await ethers.getContractFactory("Radiohead");
		const radiohead = await Radiohead.deploy(escrow.address);

		expect(ethers.utils.isAddress(radiohead.address)).to.be.true;
	});
});

describe("create a song", () => {
	it("create a  regular song", async function () {
		const { radiohead, artist1 } = await loadFixture(deployRadioheadFixture);
		let currentSongCounter = await radiohead.getCurrentSongId();
		expect(
			await radiohead.balanceOf(artist1.address, currentSongCounter - 1)
		).to.equal(BigInt(10 ** 12)); //regular songs
	});

	it("create a limited song", async () => {
		const { radiohead, artist1 } = await loadFixture(deployRadioheadFixture);
		let currentSongCounter = await radiohead.getCurrentSongId();
		expect(
			await radiohead.balanceOf(artist1.address, currentSongCounter)
		).to.equal(15); //limited songs
	});

	it("approve escrow to sell songs on behalf of artist", async () => {
		const { radiohead, artist1, escrow } = await loadFixture(
			deployRadioheadFixture
		);
		expect(await radiohead.isApprovedForAll(artist1.address, escrow.address)).to
			.be.true;
	});
});

describe("buy song", async () => {
	it("buyer can buy a regular song", async () => {
		const { radiohead, regularBuyer } = await loadFixture(
			deployRadioheadFixture
		);
		await radiohead
			.connect(regularBuyer)
			.buyRegularSong(1, { value: parseEther("1") });

		expect(await radiohead.balanceOf(regularBuyer.address, 1)).to.equal(1);
	});

	it("buyer can buy a limited edition song", async () => {
		const { radiohead, superFan } = await loadFixture(deployRadioheadFixture);
		await radiohead
			.connect(superFan)
			.buyLimitedSong(1, { value: parseEther("5") });
		expect(await radiohead.balanceOf(superFan.address, 2)).to.equal(1);
	});

	const song = await radiohead.getSong(1);

	await radiohead.connect(artist1).withdrawRoyalities();
	console.log("balance", artist1.getBalance());
});

describe("withdraw", async () => {
	it("only artist or superfan can withdraw", async () => {
		const {
			escrow,
			radiohead,
			owner,
			artist1,
			artist2,
			regularBuyer1,
			superFan1,
			regularBuyer2,
			superFan2,
		} = await loadFixture(deployWithdrawFixture);

		//reverted with wasn't working. Check: https://github.com/TrueFiEng/Waffle/issues/95#issuecomment-1036791938
		//https://ethereum-waffle.readthedocs.io/en/latest/matchers.html
		await expect(
			radiohead.connect(regularBuyer1).withdrawRoyalities()
		).to.revertedWith(
			"Only artists and superfans can intitiate withdraw process"
		);

		await expect(
			radiohead.connect(regularBuyer2).withdrawRoyalities()
		).to.revertedWith(
			"Only artists and superfans can intitiate withdraw process"
		);

		await expect(radiohead.connect(artist1).withdrawRoyalities()).to.emit(
			radiohead,
			"withdrawnFunds"
		);

		await expect(radiohead.connect(superFan1).withdrawRoyalities()).to.emit(
			radiohead,
			"withdrawnFunds"
		);
	});

	it("royality distribution to platform owner", async () => {
		const {
			escrow,
			radiohead,
			owner,
			artist1,
			artist2,
			regularBuyer1,
			superFan1,
			regularBuyer2,
			superFan2,
			calcSongs,
		} = await loadFixture(deployWithdrawFixture);

		const songs = await radiohead.getSongs();
		const { platformRevenueTotal } = calcSongs(songs);

		await expect(
			radiohead.connect(artist1).withdrawRoyalities()
		).to.changeEtherBalance(owner, BigInt(platformRevenueTotal));
	});

	it("royality distribution to artists", async () => {
		const {
			escrow,
			radiohead,
			owner,
			artist1,
			artist2,
			regularBuyer1,
			superFan1,
			regularBuyer2,
			superFan2,
			calcSongs,
			closeTo,
		} = await loadFixture(deployWithdrawFixture);

		const songs = await radiohead.getSongs();

		//artist1;
		// const artist1Songs = songs.filter(
		// 	(song) => song.artist === artist1.address
		// );
		// const { artistRevenueTotal: artist1RevenueTotal } = calcSongs(artist1Songs);

		// await expect(
		// 	radiohead.connect(artist1).withdrawRoyalities()
		// ).to.changeEtherBalance(artist1, BigInt(artist1RevenueTotal));

		//artist2
		const artist2Songs = songs.filter(
			(song) => song.artist === artist2.address
		);
		const { artistRevenueTotal: artist2RevenueTotal } = calcSongs(artist2Songs);
		await expect(
			radiohead.connect(artist2).withdrawRoyalities()
		).to.changeEtherBalance(artist2, BigInt(artist2RevenueTotal));
	});
});
