require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
require("solidity-coverage");

module.exports = {
	solidity: "0.8.17",
	networks: {
		goerli: {
			url: process.env.ALCHEMY_GOERLI_URL,
			accounts: [process.env.GOERLI_PRIVATE_KEY],
		},
		fantom: {
			url: `https://rpc.ankr.com/fantom_testnet`,
			accounts: [process.env.GOERLI_PRIVATE_KEY],
		},
	},
	etherscan: {
		apiKey: {
			ftmTestnet: process.env.FANTOMSCAN_KEY,
		},
	},
};

//0x445d0804789E7c0ABa9844183f9E85EA765837dB :fantom radiohead
//0xD6796881771a30B8Bd65C6327Dc76A0e4881b8Be :fantom escrow
