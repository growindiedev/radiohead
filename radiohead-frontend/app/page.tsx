"use client";
import { useAccount, useContractRead, useContract, useProvider } from "wagmi";
import { abi as radioheadABI } from "../../artifacts/contracts/Radiohead.sol/Radiohead.json";
import { useContext } from "react";
import { formatEther } from "ethers/lib/utils.js";
import { Song, metadata, finalSong } from "@/types";
import { StateContext } from "./StateProvider";
import axios from "axios";
import SongCard from "./components/SongCard";

const Home = () => {
	const { isConnected } = useAccount();
	const provider = useProvider();
	const contract = useContract({
		address: "0x41d83183343196664713b47b7846D8b1d6177fD3", //v3
		abi: radioheadABI,
		signerOrProvider: provider,
	});

	const { songs, setSongs } = useContext(StateContext);
	const { data, isError, isLoading } = useContractRead({
		address: "0x41d83183343196664713b47b7846D8b1d6177fD3", //v3
		abi: radioheadABI,
		functionName: "getSongs",
		cacheTime: 5000,
		enabled: isConnected,
		onSuccess: async (data: Song[]) => {
			const contractData = await Promise.all(
				data.map(async (item) => {
					const obj = {
						artist: item.artist,
						regularPrice: formatEther(item.regularPrice),
						limitedPrice: formatEther(item.limitedPrice),
						limitedSongMinted: parseInt(String(item.limitedSongMinted)),
						limitedSupply: parseInt(String(item.limitedSupply)),
						ltdSongId: parseInt(String(item.ltdSongId)),
						songId: parseInt(String(item.songId)),
					};

					const tokenURI = await contract?.uri(parseInt(String(item.songId)));
					const { data }: { data: metadata } = await axios.get(
						tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
					);

					const meta = {
						...data,
						image: data.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
						animation_url: data.animation_url.replace(
							"ipfs://",
							"https://ipfs.io/ipfs/"
						),
					};

					return { ...obj, ...meta };
				})
			);

			setSongs(contractData);
		},
	});

	console.log("dem", songs);

	if (!songs || isLoading) return <div>Fetching transaction…</div>;
	if (isError) return <div>Error fetching transaction</div>;
	return (
		<div className="grid gap-6 grid-cols-[repeat(auto-fill,_minmax(220px,_1fr))] my-6 md:mx-48 sm:mx-6">
			{songs.map((song, i) => (
				<SongCard key={i} {...song} />
			))}
		</div>
	);
};

export default Home;
