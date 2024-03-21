// require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config();
// require("solidity-coverage");

// module.exports = {
// 	solidity: "0.8.17",
// 	networks: {
// 		goerli: {
// 			url: process.env.ALCHEMY_GOERLI_URL,
// 			accounts: [process.env.PRIVATE_KEY],
// 		},
// 	},
// 	etherscan: {
// 		apiKey: process.env.ETHERSCAN_KEY,
// 	},
// };

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: "0.8.17",
	networks: {
		goerli: {
			url: process.env.ALCHEMY_GOERLI_URL,
			accounts: [process.env.PRIVATE_KEY],
		},
		polygonMumbai: {
			url: process.env.ALCHEMY_MUMBAI_URL,
			accounts: [process.env.PRIVATE_KEY],
		},
	},
	etherscan: {
		apiKey: {
			goerli: process.env.ETHERSCAN_API_KEY,
			polygonMumbai: process.env.POLYSCAN_API_KEY,
		},
	},
};

//mumbai 0xdCe887c75B993AAC2Ee535Dbb4807E69BD2930f1
