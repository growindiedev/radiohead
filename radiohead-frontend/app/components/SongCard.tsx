// pass in the songId and ltdSongId
// call buyRegularSong() buyLtdSong() using useContractWrite
//also ppass in destruct the metadat in the parent and pass imgage, music URL, artist, description
//pass in other details lik
import { finalSong } from "@/types";

import React from "react";

const SongCard = ({
	songId,
	image,
	animation_url,
	attributes,
	regularPrice,
	limitedPrice,
	limitedSupply,
	limitedSongMinted,
	name,
}: finalSong) => {
	return (
		<div className="card glass shadow-xl">
			<figure className="relative">
				<img src={image} alt={name} />
				<div className="absolute top-5 bg-white px-2 left-5 text-sm">
					Limited: {limitedPrice}
				</div>
				<div className="absolute bg-white px-2 bottom-5 right-5 text-sm">
					Regular: {regularPrice}
				</div>
			</figure>
			<div className="card-body">
				<div className="badge badge-sm">
					{limitedSongMinted}/{limitedSupply} minted
				</div>
				<h2 className="card-title">{name}</h2>
				<p>{attributes[0].value} &bull; Album</p>
				<div className="card-actions justify-end my-2">
					<div className="badge badge-secondary hover:bg-secondary-focus cursor-pointer">
						🛒 Regular
					</div>
					<div className="badge badge-primary hover:bg-primary-focus cursor-pointer">
						🛒 Limited
					</div>
				</div>
			</div>
		</div>
	);
};

export default SongCard;
