"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import { abi as radioheadABI } from "../../../artifacts/contracts/Radiohead.sol/Radiohead.json";
import { NFTStorage } from "nft.storage";
import { useDebounce } from "use-debounce";
import { config } from "dotenv";

export default function CreateForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
	} = useForm();

	const createNFTData = async () => {
		const client = new NFTStorage({
			token: process.env.NFT_STORAGE!,
		});

		const nft = {
			description: getValues("description"),
			image: getValues("coverArt")[0],
			name: getValues("songName"),
			animation_url: getValues("audio")[0],
		};

		const metadata = await client.store(nft);
		console.log("metadata saved", metadata);
		return metadata;
	};

	const deBouncedInputData = useDebounce(getValues(), 1000);
	//const deBouncedNFTmetadata = useDebounce(createNFTData(), 1000)

	const { config } = usePrepareContractWrite({
		address: "0xA0D381c8Cd7B45474856AbC075b41F64881650Ac",
		abi: radioheadABI,
		functionName: "createSong",
		args: [],
	});

	const { data, isLoading, isSuccess, write } = useContractWrite(config);
	console.log("watch", deBouncedInputData[0].coverArt[0]);

	return (
		<form
			className="grid sm:grid-cols-2 grid-cols-1 gap-4 min-w-2/3 min-h-2/3 place-items-center border p-16"
			onSubmit={handleSubmit((data) => console.log(data))}
		>
			<div className="form-control w-full max-w-xs">
				<label className="label">
					<span className="label-text">Audio</span>
					<span className="label-text-alt">Max size: 100 MB</span>
				</label>
				<input
					type="file"
					className="file-input file-input-bordered file-input-sm w-full max-w-xs"
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
					className="file-input file-input-bordered file-input-sm w-full max-w-xs"
					{...register("coverArt", { required: true })}
				/>
			</div>
			<input
				type="text"
				className="input input-bordered input-primary w-full max-w-xs"
				placeholder="Song Name"
				{...register("songName", { required: true })}
			/>
			<input
				type="text"
				className="input input-bordered input-primary w-full max-w-xs"
				placeholder="Description"
				{...register("description", { required: true })}
			/>
			<input
				type="number"
				className="input input-bordered input-primary w-full max-w-xs"
				placeholder="Limited Edition Supply"
				{...register("limitedEditionSupply", {
					required: true,
					max: 1000,
					min: 1,
				})}
			/>
			<input
				type="number"
				className="input input-bordered input-primary w-full max-w-xs"
				placeholder="Limited Edition Price"
				{...register("limitedEditionPrice", { required: true, max: 100 })}
			/>

			<div className="form-control w-full max-w-xs">
				<label className="label">
					<span className="label-text">Superfan Royality</span>
					<span className="label-text-alt">💸</span>
				</label>
				<select
					className="select select-primary select-bordered select-sm w-full max-w-xs"
					{...register("superfansRoyality", { required: true })}
				>
					<option value="5">5%</option>
					<option value=" 10"> 10%</option>
					<option value=" 15"> 15%</option>
					<option value=" 20"> 20%</option>
					<option value=" 25"> 25%</option>
					<option value=" 30"> 30%</option>
					<option value=" 35"> 35%</option>
					<option value=" 40"> 40%</option>
					<option value=" 50"> 50%</option>
				</select>
			</div>

			<div className="form-control w-full max-w-xs">
				<label className="label">
					<span className="label-text">Platform Royality</span>
					<span className="label-text-alt">💸</span>
				</label>
				<select
					className="select select-primary select-bordered select-sm w-full max-w-xs"
					{...register("platformRoyality", { required: true })}
				>
					<option value="3">3%</option>
					<option value="5">5%</option>
					<option value="7">7%</option>
				</select>
			</div>
			<input
				className="input input-bordered input-primary w-full max-w-xs"
				type="number"
				placeholder="Regular Edition Price"
				{...register("regularEditionPrice", { required: true })}
			/>

			<input type="submit" className="btn w-full max-w-xs" />
		</form>
	);
}
