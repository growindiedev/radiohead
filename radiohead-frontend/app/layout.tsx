import { StateContext, StateProvider } from "./StateProvider";
import WagmiContext from "./components/WagmiContext";
import ConnectButton from "./components/ConnectButton";
import AudioPlayer from "./components/AudioPlayer";
import Navbar from "./components/Navbar";
import Playlist from "./components/Playlist";
import "./globals.css";

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
						<AudioPlayer />
					</StateProvider>
				</WagmiContext>
			</body>
		</html>
	);
}
