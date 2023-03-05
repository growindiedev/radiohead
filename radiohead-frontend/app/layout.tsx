"use client";
import { StateContext, StateProvider } from "./StateProvider";
import WagmiContext from "./components/WagmiContext";
import ConnectButton from "./components/ConnectButton";
import Navbar from "./components/Navbar";
import Playlist from "./components/Playlist";
import "./globals.css";
import dynamic from "next/dynamic";

const DynamicAudioPlayer = dynamic(() => import("./components/AudioPlayer"), {
	ssr: false,
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head />
			<body>
				<WagmiContext>
					<StateProvider>
						<Navbar>
							<ConnectButton />
						</Navbar>
						<Playlist>{children}</Playlist>
						<DynamicAudioPlayer />
					</StateProvider>
				</WagmiContext>
			</body>
		</html>
	);
}
