import React from "react";
import { songsOwnedByUser } from "@/types";
import Amplitude from "amplitudejs";

const PlaylistSong = ({
	songId,
	image,
	name,
	attributes,
	ltdSongBalance,
	regularSongBalance,
	index,
}: songsOwnedByUser & { index: number }) => {
	const formatNumber = (num: number): string => {
		return new Intl.NumberFormat("en-GB", {
			notation: "compact",
			compactDisplay: "short",
		}).format(num);
	};

	return (
		<span
			data-amplitude-song-index={index}
			className="flex items-center space-x-3 song amplitude-song-container amplitude-play-pause w-full overflow-scroll glass shadow-xl p-2 my-1 cursor-pointer"
		>
			<div className="avatar">
				<div className="mask mask-squircle w-16 h-16">
					<img src={image} />
				</div>
			</div>
			<div>
				<div className="font-bold text-sm">{name}</div>
				{/* <div className="text-sm opacity-50 animate-marquee whitespace-nowrap overflow-hidden absolute"> */}
				<div className="text-xs mb-1">{attributes[0].value} &bull; Album</div>
				<div className="flex gap-1">
					<div className="badge badge-xs badge-secondary">
						limited: {formatNumber(ltdSongBalance)}
					</div>
					<div className="badge badge-xs">
						regular: {formatNumber(regularSongBalance)}
					</div>
				</div>
			</div>
		</span>
	);
};

export default PlaylistSong;
