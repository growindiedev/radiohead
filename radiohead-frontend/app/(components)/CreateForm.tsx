"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { usePrepareContractWrite, useContractWrite, useAccount } from "wagmi";
import { abi as radioheadABI } from "../../../artifacts/contracts/Radiohead.sol/Radiohead.json";
import { NFTStorage } from "nft.storage";
import { useDebounce } from "use-debounce";
import { parseEther } from "ethers/lib/utils.js";
import { ErrorMessage } from "@hookform/error-message";
import { toast } from "react-toastify";
import { NFTSTORAGEAPI, RADIOHEAD_GOERLI } from "@/constants";

export default function CreateForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
		reset,
	} = useForm();

	const { isConnected } = useAccount();
	const [nftURI, setNftURI] = useState<string>("");
	const [uploading, setUploading] = useState<boolean>(false);
	const deBouncedInputData = useDebounce(getValues(), 1000)[0];

	const { config } = usePrepareContractWrite({
		address: RADIOHEAD_GOERLI,
		abi: radioheadABI,
		functionName: "createSong",
		enabled: isConnected && Boolean(nftURI),
		args: [
			deBouncedInputData.limitedEditionSupply,
			deBouncedInputData.regularEditionPrice &&
				parseEther(deBouncedInputData.regularEditionPrice),
			deBouncedInputData.limitedEditionPrice &&
				parseEther(deBouncedInputData.limitedEditionPrice),
			nftURI,
			deBouncedInputData.platformRoyality,
			deBouncedInputData.superfansRoyality,
		],
	});

	const { isLoading: isMinting, write } = useContractWrite({
		...config,
		onSuccess(data) {
			reset();
			setNftURI("");
			toast.success(
				`Successfully submitted the song creation request. Please wait`,
				{
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				}
			);
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

	const createMetaData = (e: any) => {
		e.preventDefault();
		const handleNFTStorage = async () => {
			const client = new NFTStorage({
				token: NFTSTORAGEAPI,
			});

			const nft = {
				description: getValues("description"),
				image: getValues("coverArt")[0],
				name: getValues("songName"),
				animation_url: getValues("audio")[0],
				attributes: [
					{
						trait_type: "Artist",
						value: getValues("artistName"),
					},
					{
						trait_type: "Album",
						value: getValues("albumName"),
					},
				],
			};
			try {
				setUploading(true);
				const metadata = await client.store(nft);
				setNftURI(metadata.url);
				setUploading(false);
			} catch (error) {
				setUploading(false);
				console.log(error);
			}
		};
		handleSubmit(handleNFTStorage)();
		toast.promise(handleNFTStorage, {
			pending: "Please wait while we upload your song to IPFS",
			success: "Successfully uploaded 👌. Press the create the song button",
			error: "Something went wrong 🤯",
		});
	};

	return (
		<>
			<form className="bg-base-200 grid sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-3 gap min-w-2/3 min-h-2/3 place-items-center p-16 rounded-md shadow-2xl">
				<div className="form-control w-full max-w-xs">
					<label className="label">
						<span className="label-text">Audio</span>
						<span className="label-text-alt">Max size: 100 MB</span>
					</label>
					<input
						type="file"
						accept="audio/*"
						className="file-input file-input-bordered file-input-sm w-full max-w-xs"
						disabled={Boolean(nftURI)}
						{...register("audio", { required: true })}
					/>
				</div>
				<div className="form-control w-full max-w-xs">
					<label className="label">
						<span className="label-text">Cover Art</span>
						<span className="label-text-alt">Max size: 100 MB</span>
					</label>
					<input
						type="file"
						accept="image/*"
						className="file-input file-input-bordered file-input-sm w-full max-w-xs"
						disabled={Boolean(nftURI)}
						{...register("coverArt", { required: true })}
					/>
				</div>
				<div className="form-control w-full max-w-xs">
					<label className="label">
						<span className="label-text">Song Name</span>
					</label>
					<input
						type="text"
						className="input input-bordered input-sm w-full max-w-xs"
						placeholder="Song Name"
						disabled={Boolean(nftURI)}
						{...register("songName", { required: true })}
					/>
				</div>
				<div className="form-control w-full max-w-xs">
					<label className="label">
						<span className="label-text">Album</span>
					</label>
					<input
						type="text"
						className="input input-bordered input-sm w-full max-w-xs"
						placeholder="Album Name"
						disabled={Boolean(nftURI)}
						{...register("albumName", { required: true })}
					/>
				</div>
				<div className="form-control w-full col-span-full">
					<label className="label">
						<span className="label-text">Description</span>
					</label>
					<textarea
						//type="text"
						className="input input-bordered w-full input-sm"
						placeholder="Description"
						disabled={Boolean(nftURI)}
						{...register("description", { required: true })}
					/>
				</div>
				<div className="form-control w-full max-w-xs">
					<label className="label">
						<span className="label-text">Limited Edition Supply</span>
					</label>
					<input
						type="number"
						className="input input-bordered input-sm w-full max-w-xs"
						placeholder="Limited Edition Supply"
						{...register("limitedEditionSupply", {
							required: true,
							max: 1000,
							min: 1,
						})}
					/>
					<ErrorMessage
						errors={errors}
						name="limitedEditionSupply"
						render={({ message }) => (
							<label className="label">
								<span className="label-text-alt text-error">{message}</span>
							</label>
						)}
					/>
				</div>
				<div className="form-control w-full max-w-xs">
					<label className="label">
						<span className="label-text">Limited Edition Price</span>
					</label>
					<input
						className="input input-bordered w-full input-sm max-w-xs"
						placeholder="Limited Edition Price"
						{...register("limitedEditionPrice", {
							required: true,
							max: 100,
							pattern: {
								value: /^(0|[1-9]\d*)(\.\d+)?$/,
								message: "only numeric values are allowed",
							},
						})}
					/>
					<ErrorMessage
						errors={errors}
						name="limitedEditionPrice"
						render={({ message }) => (
							<label className="label">
								<span className="label-text-alt text-error">{message}</span>
							</label>
						)}
					/>
				</div>

				<div className="form-control w-full max-w-xs">
					<label className="label">
						<span className="label-text">Superfan Royality</span>
						<span className="label-text-alt">💸</span>
					</label>
					<select
						className="select select-bordered select-sm w-full max-w-xs"
						{...register("superfansRoyality", { required: true })}
					>
						<option value="5">5%</option>
						<option value="10">10%</option>
						<option value="15">15%</option>
						<option value="20">20%</option>
						<option value="25">25%</option>
						<option value="30">30%</option>
						<option value="35">35%</option>
						<option value="40">40%</option>
						<option value="50">50%</option>
					</select>
				</div>

				<div className="form-control w-full max-w-xs">
					<label className="label">
						<span className="label-text">Platform Royality</span>
						<span className="label-text-alt">💸</span>
					</label>
					<select
						className="select select-bordered select-sm w-full max-w-xs"
						{...register("platformRoyality", { required: true })}
					>
						<option value="3">3%</option>
						<option value="5">5%</option>
						<option value="7">7%</option>
					</select>
				</div>
				<div className="form-control w-full max-w-xs">
					<label className="label">
						<span className="label-text">Regular Edition Price</span>
					</label>
					<input
						className="input input-bordered w-full input-sm max-w-xs"
						placeholder="Regular Edition Price"
						{...register("regularEditionPrice", {
							required: true,
							pattern: {
								value: /^(0|[1-9]\d*)(\.\d+)?$/,
								message: "only numeric values are allowed",
							},
						})}
					/>
					<ErrorMessage
						errors={errors}
						name="regularEditionPrice"
						render={({ message }) => (
							<label className="label">
								<span className="label-text-alt text-error">{message}</span>
							</label>
						)}
					/>
				</div>
				<div className="form-control w-full max-w-xs">
					<label className="label">
						<span className="label-text">Artist Name</span>
					</label>
					<input
						className="input input-bordered w-full input-sm max-w-xs"
						placeholder="Artist Name"
						disabled={Boolean(nftURI)}
						{...register("artistName", { required: true })}
					/>
				</div>
				<button
					disabled={Boolean(nftURI) || uploading || !isConnected}
					className={`btn w-full max-w-xs mt-2 ${uploading && `loading`}`}
					onClick={createMetaData}
				>
					{uploading ? `⌛️ Uploading..` : `Upload to IPFS`}
				</button>
				<button
					className={`btn w-full max-w-xs mt-2 ${isMinting && `loading`}`}
					disabled={!write || !Boolean(nftURI) || isMinting || !isConnected}
					onClick={handleSubmit(() => write?.())}
				>
					{isMinting ? "creating..." : "create song"}
				</button>
			</form>
		</>
	);
}
