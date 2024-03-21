import { songWithMetadata } from "@/types";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { abi as radioheadABI } from "../../../artifacts/contracts/Radiohead.sol/Radiohead.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { parseEther } from "ethers/lib/utils.js";

import React from "react";
import { CONTRACT_ADDRESS } from "@/constants";

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
		address: CONTRACT_ADDRESS,
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
			toast.success(`Successfully submitted the request. Please wait `, {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		},
		onError(error) {
			toast.error(String(error), {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		},
	});

	const { config: limitedConfig } = usePrepareContractWrite({
		address: CONTRACT_ADDRESS,
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
			toast.success(`Successfully submitted the request. Please wait `, {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		},
		onError(error) {
			toast.error(String(error), {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
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
				<p>
					{attributes[0]?.value} &bull; {attributes[1]?.value}
				</p>
				<div className="card-actions justify-end my-2">
					{address !== artist && (
						<div className="btn-group">
							<button
								disabled={isLoadingRegular || !mintRegular}
								className={`btn btn-xs btn-primary ${
									isLoadingRegular && `loading`
								}`}
								onClick={() => mintRegular?.()}
							>
								Buy Regular
							</button>
							{limitedSupply !== limitedSongMinted && (
								<button
									disabled={isLoadingLimited || !mintLimited}
									className={`btn btn-xs btn-primary btn-outline ${
										isLoadingLimited && `loading`
									}`}
									onClick={() => mintLimited?.()}
								>
									Buy Limited
								</button>
							)}
						</div>
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
