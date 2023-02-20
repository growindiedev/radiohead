import WagmiContext from "./components/WagmiContext";
import ConnectButton from "./components/ConnectButton";
import Link from "next/link";

import "./globals.css";
import AudioPlayer from "./components/AudioPlayer";

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
					<div className="navbar bg-base-100 shadow-lg">
						<div className="navbar-start">
							<div className="dropdown">
								<label tabIndex={0} className="btn btn-ghost lg:hidden">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M4 6h16M4 12h8m-8 6h16"
										/>
									</svg>
								</label>
								<ul
									tabIndex={0}
									className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
								>
									<li>
										<Link href="/create">Create</Link>
									</li>
									<li>
										<Link href="/withdraw">Withdraw</Link>
									</li>
									<li>
										<Link href="/about">About</Link>
									</li>
								</ul>
							</div>
							<Link href="/" className="btn btn-ghost normal-case text-xl">
								📻💀 RadioHEAD
							</Link>
						</div>
						<div className="navbar-center hidden lg:flex">
							<ul className="menu menu-horizontal px-1">
								<li>
									<Link href="/create">Create</Link>
								</li>
								<li>
									<Link href="/withdraw">Withdraw</Link>
								</li>
								<li>
									<Link href="/about">About</Link>
								</li>
							</ul>
						</div>
						<div className="navbar-end">
							<ConnectButton />
						</div>
					</div>
					<div className="drawer h-[calc(100vh-11rem)]">
						<input id="my-drawer" type="checkbox" className="drawer-toggle" />
						<div className="drawer-content">
							<div className="h-[calc(100vh-11rem)] overflow-y-scroll">
								{children}
							</div>
						</div>
						<div className="drawer-side">
							<label htmlFor="my-drawer" className="drawer-overlay"></label>
							<ul className="menu p-4 w-80 bg-base-100 text-base-content">
								<div className="white-player-playlist border border-indigo-500">
									<div
										className="flex items-center space-x-3 amplitude-song-container amplitude-play-pause w-full overflow-scroll"
										data-amplitude-song-index="0"
									>
										<div className="avatar">
											<div className="mask mask-squircle w-14 h-14">
												<img src="https://521dimensions.com/img/open-source/amplitudejs/album-art/we-are-to-answer.jpg" />
											</div>
										</div>
										<div>
											<div className="font-bold">Risin' High</div>
											{/* <div className="text-sm opacity-50 animate-marquee whitespace-nowrap overflow-hidden absolute"> */}
											<marquee>
												Ancient Astronauts &bull; We Are to Answer
											</marquee>
										</div>
									</div>
								</div>
								<li>
									<a>Sidebar Item 1</a>
								</li>
								<li>
									<a>Sidebar Item 2</a>
								</li>
							</ul>
						</div>
					</div>
					<AudioPlayer />
				</WagmiContext>
			</body>
		</html>
	);
}
