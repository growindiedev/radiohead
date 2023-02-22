import React from "react";
import { songOwnedByUser } from "@/types";

const PlaylistSong = ({
	image,
	name,
	attributes,
	ltdSongBalance,
	regularSongBalance,
}: songOwnedByUser) => {
	const formatNumber = (num: number): string => {
		return new Intl.NumberFormat("en-GB", {
			notation: "compact",
			compactDisplay: "short",
		}).format(num);
	};
	return (
		<div
			className="flex items-center space-x-3 amplitude-song-container amplitude-play-pause w-full overflow-scroll glass shadow-xl p-2 my-1"
			data-amplitude-song-index="0"
		>
			<div className="avatar">
				<div className="mask mask-squircle w-16 h-16">
					<img src={image} />
				</div>
			</div>
			<div>
				<div className="font-bold text-sm">{name}</div>
				{/* <div className="text-sm opacity-50 animate-marquee whitespace-nowrap overflow-hidden absolute"> */}
				<marquee className="text-xs">
					{attributes[0].value} &bull; Album
				</marquee>
				<div className="flex gap-1">
					<div className="badge badge-xs badge-secondary">
						limited: {formatNumber(ltdSongBalance)}
					</div>
					<div className="badge badge-xs">
						regular: {formatNumber(regularSongBalance)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PlaylistSong;
