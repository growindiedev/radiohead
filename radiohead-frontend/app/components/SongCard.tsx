// pass in the songId and ltdSongId
// call buyRegularSong() buyLtdSong() using useContractWrite
//also ppass in destruct the metadat in the parent and pass imgage, music URL, artist, description
//pass in other details lik
import { songWithMetadata } from "@/types";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { abi as radioheadABI } from "../../../artifacts/contracts/Radiohead.sol/Radiohead.json";

import React from "react";
import { parseEther } from "ethers/lib/utils.js";

const SongCard = ({
	songId,
	image,
	attributes,
	regularPrice,
	limitedPrice,
	limitedSupply,
	limitedSongMinted,
	name,
	artist,
}: songWithMetadata) => {
	const { address, isConnected } = useAccount();

	const { config: regularConfig } = usePrepareContractWrite({
		address: "0x41d83183343196664713b47b7846D8b1d6177fD3",
		abi: radioheadABI,
		functionName: "buyRegularSong",
		enabled: isConnected,
		args: [songId],
		overrides: {
			value: parseEther(regularPrice),
		},
	});

	const {
		isLoading: isLoadingRegular,
		write: mintRegular,
		error: errorFromRegular,
		isError: isErrorRegular,
		isSuccess: isMintedRegularSong,
	} = useContractWrite({
		...regularConfig,
		onSuccess(data) {
			console.log("Success regular", data);
		},
		onError(error) {
			alert(error);
		},
	});

	const { config: limitedConfig } = usePrepareContractWrite({
		address: "0x41d83183343196664713b47b7846D8b1d6177fD3",
		abi: radioheadABI,
		functionName: "buyLimitedSong",
		enabled: isConnected,
		args: [songId],
		overrides: {
			value: parseEther(limitedPrice),
		},
	});

	const {
		isLoading: isLoadingLimited,
		write: mintLimited,
		error: errorFromLimited,
		isError: isErrorLimited,
		isSuccess: isMintedLimitedSong,
	} = useContractWrite({
		...limitedConfig,
		onSuccess(data) {
			console.log("Success limited", data);
		},
		onError(error) {
			alert(error);
		},
	});

	return (
		<div className="card glass shadow-xl">
			<figure className="relative">
				<img src={image} alt={name} />
				<div className="card-actions justify-end my-2">
					<div className="absolute top-5 bg-white px-2 left-5 text-sm">
						Limited: {limitedPrice}
					</div>
					<div className="absolute bg-white px-2 bottom-5 right-5 text-sm">
						Regular: {regularPrice}
					</div>
				</div>
			</figure>
			<div className="card-body">
				<div className="badge badge-sm">
					{limitedSongMinted}/{limitedSupply} Minted
				</div>
				<h2 className="card-title">{name}</h2>
				<p>{attributes[0].value} &bull; Album</p>
				<div className="card-actions justify-end my-2">
					{address !== artist && (
						<>
							<button
								disabled={isLoadingRegular || isErrorRegular || !mintRegular}
								className="badge badge-secondary hover:bg-secondary-focus cursor-pointer"
								onClick={() => mintRegular?.()}
							>
								{isLoadingRegular || isErrorRegular || !mintRegular
									? "⌛️ Processing..."
									: "🛒 Regular"}
							</button>
							{limitedSupply !== limitedSongMinted && (
								<button
									disabled={isLoadingLimited || isErrorLimited || !mintLimited}
									className="badge badge-primary active:bg-primary-focus cursor-pointer"
									onClick={() => mintLimited?.()}
								>
									{isLoadingLimited || isErrorLimited || !mintLimited
										? "⌛️ Processing..."
										: "🛒 Limited"}
								</button>
							)}
						</>
					)}
					{address === artist && (
						<div className="badge badge-success">Created by you</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default SongCard;
