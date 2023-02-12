"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import {
	polygon,
	goerli,
	polygonMumbai,
	fantomTestnet,
	localhost,
} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
	[goerli, polygonMumbai, fantomTestnet, localhost],
	[
		alchemyProvider({ apiKey: process.env.GOERLI_ALCHEMY_ID! }),
		alchemyProvider({ apiKey: process.env.MUMBAI_ALCHEMY_ID! }),
		publicProvider(),
	]
);

const { connectors } = getDefaultWallets({
	appName: "My RainbowKit App",
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
