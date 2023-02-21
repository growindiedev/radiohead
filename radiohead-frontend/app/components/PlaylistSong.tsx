import React from "react";

const PlaylistSong = () => {
	return (
		<div
			className="flex items-center space-x-3 amplitude-song-container amplitude-play-pause w-full overflow-scroll border border-indigo-500"
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
					<div className="badge badge-xs badge-secondary">limited: 5</div>
					<div className="badge badge-xs">regular: 1</div>
				</div>
			</div>
		</div>
	);
};

export default PlaylistSong;
