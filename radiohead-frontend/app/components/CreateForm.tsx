"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import { abi as radioheadABI } from "../../../artifacts/contracts/Radiohead.sol/Radiohead.json";
import { NFTStorage } from "nft.storage";
import { useDebounce } from "use-debounce";
import { parseEther } from "ethers/lib/utils.js";
import { ErrorMessage } from "@hookform/error-message";

type FormValues = {
	limitedEditionSupply: string;
	regularEditionPrice: string;
	limitedEditionPrice: string;
	platformRoyality: string;
	superfansRoyality: string;
	coverArt: File;
	audio: File;
};

export default function CreateForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
		watch,
		reset,
	} = useForm();

	const [nftURI, setNftURI] = useState<string>("");
	const [uploading, setUploading] = useState<boolean>(false);
	const deBouncedInputData = useDebounce(getValues(), 200)[0];

	const { config } = usePrepareContractWrite({
		address: "0xA0D381c8Cd7B45474856AbC075b41F64881650Ac",
		abi: radioheadABI,
		functionName: "createSong",
		args: [
			deBouncedInputData.limitedEditionSupply,
			deBouncedInputData.regularEditionPrice,
			deBouncedInputData.limitedEditionPrice,
			nftURI,
			deBouncedInputData.platformRoyality,
			deBouncedInputData.superfansRoyality,
		],
	});

	const {
		data,
		isLoading: isMinting,
		write,
		error,
		isError,
		isSuccess,
	} = useContractWrite({
		...config,
		onSuccess(data) {
			reset();
			setNftURI("");
			console.log("Success", data);
		},
	});

	const createMetaData = (e: any) => {
		e.preventDefault();
		handleSubmit(async () => {
			try {
				const client = new NFTStorage({
					token:
						"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDY5M2QxZjVDZEQyMDhGMjdGNTM5OGI2ZGM1ODdBM2Y5ODkxMGYzYkEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3NjEyMDgxNjIxOCwibmFtZSI6InJhZGlvaGVhZCJ9.q_UYxh57NBUNnHTN7b4PTNfzTxC6eQ7layhT_HcH5UI",
				});
				const nft = {
					description: getValues("description"),
					image: getValues("coverArt")[0],
					name: getValues("songName"),
					animation_url: getValues("audio")[0],
					attributes: [
						{
							trait_type: "Artist Name",
							value: getValues("artistName"),
						},
					],
				};
				setUploading(true);
				const metadata = await client.store(nft);
				setNftURI(metadata.url);
				setUploading(false);
				console.log("metdata", metadata.url);
			} catch (err) {
				console.log("errrrMeta", err);
				setUploading(false);
			}
		})();
	};

	return (
		<>
			<form className="grid sm:grid-cols-2 grid-cols-1 gap-4 min-w-2/3 min-h-2/3 place-items-center border p-16 ">
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
						className="input input-bordered  input-sm w-full max-w-xs"
						placeholder="Song Name"
						disabled={Boolean(nftURI)}
						{...register("songName", { required: true })}
					/>
				</div>
				<div className="form-control w-full max-w-xs">
					<label className="label">
						<span className="label-text">Description</span>
					</label>
					<input
						type="text"
						className="input input-bordered w-full input-sm max-w-xs"
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
						className="input input-bordered input-sm w-full max-w-xs"
						placeholder="Limited Edition Supply"
						{...register("limitedEditionSupply", {
							required: true,
							max: 1000,
							min: 1,
							pattern: {
								value: /^\d+(\.\d{1,2})?$/,
								message: "only numeric values are allowed",
							},
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
								value: /^\d+(\.\d{1,2})?$/,
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
								value: /^\d+(\.\d{1,2})?$/,
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
					disabled={Boolean(nftURI) || uploading}
					className="btn w-full max-w-xs"
					onClick={createMetaData}
				>
					{uploading ? `⌛️ Uploading..` : `Upload to IPFS`}
				</button>
				<button
					type="submit"
					disabled={!write || !Boolean(nftURI) || isMinting}
					className="btn w-full max-w-xs"
					onClick={handleSubmit(() => {
						write?.();
						console.log(getValues());
					})}
				>
					{isMinting ? "creating..." : "create song"}
				</button>
			</form>
			{isSuccess && (
				<div>
					Successfully minted your NFT!
					<div>
						<a
							className="link-primary"
							href={`https://goerli.etherscan.io/tx/${data?.hash}`}
						>
							Etherscan
						</a>
					</div>
				</div>
			)}
			{isError && <div>Error: {error?.message}</div>}
		</>
	);
}
