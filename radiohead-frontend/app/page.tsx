"use client";
import { useContractRead } from "wagmi";
import { abi as radioheadABI } from "../../artifacts/contracts/Radiohead.sol/Radiohead.json";
import { NFTStorage } from "nft.storage";

const Home = () => {
	const { data, isError, isLoading } = useContractRead({
		address: "0xecb504d39723b0be0e3a9aa33d646642d1051ee1",
		abi: radioheadABI,
		functionName: "getHunger",
	});

	return (
		<div className="grid gap-6 grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] m-6 pt-20">
			home
		</div>
	);
};

export default Home;
