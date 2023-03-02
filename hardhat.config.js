require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("solidity-coverage");

module.exports = {
	solidity: "0.8.17",
	networks: {
		// hardhat: {
		// 	gasPrice: 0,
		// 	gas: 0,
		// 	gasMultiplier: 0,
		// },
		goerli: {
			url: process.env.ALCHEMY_GOERLI_URL,
			accounts: [process.env.GOERLI_PRIVATE_KEY],
		},
	},
	etherscan: {
		apiKey: process.env.ETHERSCAN_KEY,
	},
};
