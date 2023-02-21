"use client";

import { createContext, Dispatch, SetStateAction, useState } from "react";
//import { Song, metadata, finalSong } from "@/types";
import { useAccount, useContractRead, useContract, useProvider } from "wagmi";
import { abi as radioheadABI } from "../../artifacts/contracts/Radiohead.sol/Radiohead.json";
import { formatEther } from "ethers/lib/utils.js";
import { Song, metadata, finalSong } from "@/types";
import axios from "axios";

export type contextType = {
	songs: finalSong[] | undefined;
	setSongs: Dispatch<SetStateAction<any>>;
	isLoading: boolean;
	isError: boolean;
};

export const StateContext = createContext({} as contextType);

export function StateProvider({
	children,
	retrievedSongs,
}: {
	children: React.ReactNode;
	retrievedSongs?: finalSong[];
}) {
	const [songs, setSongs] = useState<finalSong[]>();

	const provider = useProvider();
	const contract = useContract({
		address: "0x41d83183343196664713b47b7846D8b1d6177fD3", //v3
		abi: radioheadABI,
		signerOrProvider: provider,
	});

	const { isError, isLoading } = useContractRead({
		address: "0x41d83183343196664713b47b7846D8b1d6177fD3", //v3
		abi: radioheadABI,
		functionName: "getSongs",
		cacheTime: 5000,
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
	return (
		<StateContext.Provider value={{ songs, setSongs, isError, isLoading }}>
			{children}
		</StateContext.Provider>
	);
}
