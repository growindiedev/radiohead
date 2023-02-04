const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { parseEther, formatEther } = require("ethers/lib/utils");

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
			15,
			parseEther("1"),
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
			parseEther("1"),
			parseEther("6"),
			"regular2",
			"limited2",
			4,
			17
		);

	await radiohead
		.connect(regularBuyer1)
		.buyRegularSong(3, { value: parseEther("1") });

	await radiohead
		.connect(regularBuyer1)
		.buyRegularSong(3, { value: parseEther("3") });

	await radiohead
		.connect(regularBuyer2)
		.buyRegularSong(3, { value: parseEther("1") });

	await radiohead
		.connect(regularBuyer2)
		.buyRegularSong(3, { value: parseEther("3") });

	await radiohead
		.connect(superFan1)
		.buyLimitedSong(3, { value: parseEther("6") });

	await radiohead
		.connect(superFan1)
		.buyLimitedSong(3, { value: parseEther("6") });

	await radiohead
		.connect(superFan2)
		.buyLimitedSong(3, { value: parseEther("6") });

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
			.buyLimitedSong(1, { value: parseEther("50") });
		//const platformBalance = await ;
		console.log("radiohead", formatEther(platformBalance));
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

		const prevBalance = await superFan1.getBalance();
		await radiohead.connect(artist1).withdrawRoyalities();
		const currentBalance = await superFan1.getBalance();
		const provider = ethers.getDefaultProvider();
		const platformBalance = await provider.getBalance(radiohead.address);
		console.log("radiohead", formatEther(platformBalance));

		expect(platformBalance).to.greaterThan(0);
	});
});

// it("royalities are divided evenly and distributed to respective parties", async () => {});
