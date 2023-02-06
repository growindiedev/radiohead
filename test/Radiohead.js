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
		.createSong(
			15,
			parseEther("1"),
			parseEther("5"),
			"regular1",
			"limited1",
			5,
			20
		);

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
		.createSong(
			6,
			parseEther("2"),
			parseEther("5"),
			"regular1",
			"limited1",
			5,
			20
		);

	await radiohead
		.connect(artist1)
		.createSong(
			3,
			parseEther("3"),
			parseEther("7"),
			"regular2",
			"limited2",
			4,
			17
		);

	// await radiohead
	// 	.connect(regularBuyer1)
	// 	.buyRegularSong(1, { value: parseEther("2") });

	// await radiohead
	// 	.connect(regularBuyer1)
	// 	.buyRegularSong(1, { value: parseEther("2") });

	// await radiohead
	// 	.connect(superFan1)
	// 	.buyLimitedSong(1, { value: parseEther("5") });

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

	// await radiohead
	// 	.connect(superFan2)
	// 	.buyLimitedSong(3, { value: parseEther("7") });

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
		).to.equal(BigInt(10 ** 18)); //regular songs
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

	await radiohead.connect(artist1).withdrawRoyalities();
	console.log("balance", artist1.getBalance());
});

describe("withdraw funds", async () => {
	it("artist can withdraw", async () => {
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

		const toRound = (num) => {
			String(num).slice(0, 5);
		};

		const song = await radiohead.getSong(3);
		const prevArtist1Balance = await artist1.getBalance();
		const prevSuperfan1Balance = await superFan1.getBalance();
		await radiohead.connect(artist1).withdrawRoyalities();
		let platformBalance = await ethers.provider.getBalance(radiohead.address);
		//platformBalance = platformBalance.toString().slice(0, 4);
		const currentArtist1Balance = await artist1.getBalance();
		const currentSuperfan1Balance = await superFan1.getBalance();
		const artist1Balance = currentArtist1Balance - prevArtist1Balance;
		// .toString()
		// .slice(0, 4);
		const superfan1Balance = currentSuperfan1Balance - prevSuperfan1Balance;
		// .toString()
		// .slice(0, 4);

		const calcPlatformRoyality =
			(song.platformRoyality * song.ltdRevenue) / 100 +
			(song.platformRoyality * song.regularRevenue) / 100;
		// .toString()
		// .slice(0, 4);
		let superfan1Songs = await radiohead.getSongOwners(superFan1.address);
		let noOfOwnedfGivenSong = superfan1Songs
			.map((i) => Number(i))
			.reduce((acc, item) => {
				if (item == Number(song.ltdSongId)) {
					acc += 1;
				}
				return acc;
			}, 0);

		const calcSuperfanRoyality =
			(((song.regularRevenue / 100) * song.superfanRoyality) /
				song.limitedSupply) *
			noOfOwnedfGivenSong;
		// .toString()
		// .slice(0, 4);

		const calcArtist1Royality =
			song.regularRevenue -
			(song.platformRoyality * song.regularRevenue) / 100 +
			(song.ltdRevenue - (song.platformRoyality * song.ltdRevenue) / 100) -
			calcSuperfanRoyality * song.superfans.length;

		// const calcArtist1Royality = (
		// 	song.regularRevenue +
		// 	song.ltdRevenue -
		// 	platformBalance -
		// 	calcSuperfanRoyality * song.superfans.length
		// )
		// 	.toString()
		// 	.slice(0, 4);
		//expect(BigInt(calcSuperfanRoyality)).to.equal(BigInt(superfan1Balance));
		expect(BigInt(calcPlatformRoyality)).to.equal(BigInt(platformBalance));

		expect(BigInt(calcArtist1Royality)).to.equal(BigInt(artist1Balance));
	});
});
