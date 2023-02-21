import { StateContext, StateProvider } from "./StateProvider";
import WagmiContext from "./components/WagmiContext";
import ConnectButton from "./components/ConnectButton";
import AudioPlayer from "./components/AudioPlayer";
import Navbar from "./components/Navbar";
import Drawer from "./components/Drawer";
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
						<Drawer>{children}</Drawer>
						<AudioPlayer />
					</StateProvider>
				</WagmiContext>
			</body>
		</html>
	);
}
