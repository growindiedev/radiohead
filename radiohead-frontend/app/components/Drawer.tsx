import React from "react";

const Drawer = ({ children }: { children: React.ReactNode }) => {
	return (
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
								<div className="mask mask-squircle w-16 h-16">
									<img src="https://521dimensions.com/img/open-source/amplitudejs/album-art/we-are-to-answer.jpg" />
								</div>
							</div>
							<div>
								<div className="font-bold text-sm">Risin' High ding dong</div>
								{/* <div className="text-sm opacity-50 animate-marquee whitespace-nowrap overflow-hidden absolute"> */}
								<marquee className="text-xs">
									Ancient Astronauts &bull; We Are to Answer
								</marquee>
								<div className="flex gap-1">
									<div className="badge badge-xs badge-secondary">
										limited: 5
									</div>
									<div className="badge badge-xs">regular: 1</div>
								</div>
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
	);
};

export default Drawer;
