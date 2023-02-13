"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { usePrepareContractWrite } from "wagmi";
import { abi as radioheadABI } from "../../../artifacts/contracts/Radiohead.sol/Radiohead.json";

export default function CreateForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	console.log(errors);

	const { config } = usePrepareContractWrite({
		address: "0x511Fb8f28695Cf27Efaa9a6CDD940dAE0b3899E3",
		abi: radioheadABI,
		functionName: "createSong",
	});

	return (
		<form
			className="grid sm:grid-cols-2 grid-cols-1 gap-4 min-w-2/3 min-h-2/3 place-items-center border p-16"
			onSubmit={handleSubmit(() => alert("submitted"))}
		>
			<div className="form-control w-full max-w-xs">
				<label className="label">
					<span className="label-text">Audio</span>
					<span className="label-text-alt">Max size: 100 MB</span>
				</label>
				<input
					type="file"
					className="file-input file-input-bordered file-input-sm w-full max-w-xs"
					{...register("Audio", { required: true })}
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
					{...register("Cover Art", { required: true })}
				/>
			</div>
			<input
				type="text"
				className="input input-bordered input-primary w-full max-w-xs"
				placeholder="Name"
				{...register("Name", { required: true })}
			/>
			<input
				type="text"
				className="input input-bordered input-primary w-full max-w-xs"
				placeholder="Description"
				{...register("Description", { required: true })}
			/>
			<input
				type="number"
				className="input input-bordered input-primary w-full max-w-xs"
				placeholder="Limited Edition Supply"
				{...register("Limited Edition Supply", {
					required: true,
					max: 1000,
					min: 1,
				})}
			/>
			<input
				type="number"
				className="input input-bordered input-primary w-full max-w-xs"
				placeholder="Limited Edition Price"
				{...register("Limited Edition Price", { required: true, max: 100 })}
			/>

			<div className="form-control w-full max-w-xs">
				<label className="label">
					<span className="label-text">Superfan Royality</span>
					<span className="label-text-alt">💸</span>
				</label>
				<select
					className="select select-primary select-bordered select-sm w-full max-w-xs"
					{...register("Superfans", { required: true })}
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
					{...register("Radiohead", { required: true })}
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
				{...register("Regular Edition Price", { required: true })}
			/>

			<input type="submit" className="btn w-full max-w-xs" />
		</form>
	);
}
