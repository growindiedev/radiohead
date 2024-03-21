"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygon, goerli, polygonMumbai, fantomTestnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

// const { chains, provider } = configureChains(
// 	[polygonMumbai],
// 	[
// 		alchemyProvider({ apiKey: process.env.MUMBAI_ALCHEMY_ID! }),
// 		//alchemyProvider({ apiKey: process.env.MUMBAI_ALCHEMY_ID! }),
// 		publicProvider(),
// 	]
// );

const { chains, provider } = configureChains(
	[polygonMumbai], // Add more chains from "wagmi/chains" here
	[
		alchemyProvider({ apiKey: process.env.MUMBAI_ALCHEMY_ID! }),
		publicProvider(),
	] // Add more providers from "wagmi/providers/" here
);

const { connectors } = getDefaultWallets({
	appName: "radiohead",
	chains,
});
const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
});

const WagmiContext = ({ children }: { children: React.ReactNode }) => {
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider chains={chains} coolMode>
				{children}
			</RainbowKitProvider>
		</WagmiConfig>
	);
};

export default WagmiContext;
