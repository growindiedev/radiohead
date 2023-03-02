"use client";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import {
	useAccount,
	useContractRead,
	useContract,
	useProvider,
	useContractEvent,
} from "wagmi";
import { abi as radioheadABI } from "../../artifacts/contracts/Radiohead.sol/Radiohead.json";
import { formatEther } from "ethers/lib/utils.js";
import { Song, metadata, songWithMetadata, songsOwnedByUser } from "@/types";
import { demoSongs } from "./demosongs";
import axios from "axios";
import { toast } from "react-toastify";
import { RADIOHEAD_GOERLI } from "@/constants";

export type contextType = {
	songs: songWithMetadata[];
	ownedSongs: songsOwnedByUser[];
	setSongs: Dispatch<SetStateAction<any>>;
	isLoading: boolean;
	isError: boolean;
};

export const StateContext = createContext({} as contextType);

export function StateProvider({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element {
	//hardcoded initial songs on frontend for all users
	const demo: songsOwnedByUser[] = demoSongs.map((song) => ({
		image: song.cover_art_url,
		animation_url: song.url,
		description: "Free songs for radiohead users",
		name: song.name,
		attributes: [
			{
				trait_type: "artist",
				value: song.artist,
			},
			{
				trait_type: "album",
				value: song.album,
			},
		],
		artist: "radiohead",
		regularPrice: "0",
		limitedPrice: "0",
		limitedSongMinted: 0,
		limitedSupply: 0,
		ltdSongId: 0,
		songId: 0,
		regularSongBalance: 0,
		ltdSongBalance: 0,
	}));

	const [songs, setSongs] = useState<songWithMetadata[]>([]);
	const [ownedSongs, setOwnedSongs] = useState<songsOwnedByUser[]>(demo);

	const provider = useProvider();
	const contract = useContract({
		address: RADIOHEAD_GOERLI, //v4
		abi: radioheadABI,
		signerOrProvider: provider,
	});

	const retrieveOwnedSongs = async (
		address: string,
		contractData: songWithMetadata[]
	): Promise<songsOwnedByUser[]> => {
		const playListSongs = await Promise.all(
			contractData.map(async (song) => {
				const regularBalance = await contract?.balanceOf(address, song.songId);
				const ltdBalance = await contract?.balanceOf(address, song.ltdSongId);
				const obj = {
					...song,
					regularSongBalance: parseInt(String(regularBalance)),
					ltdSongBalance: parseInt(String(ltdBalance)),
				};
				return obj;
			})
		);

		const songsOwnedCurrently = playListSongs.filter(
			(song) => song.regularSongBalance > 0 || song.ltdSongBalance > 0
		);
		return songsOwnedCurrently;
	};

	const retrieveAllSongs = async (
		data: Song[]
	): Promise<songWithMetadata[]> => {
		const allSongs = await Promise.all(
			data.map(async (item) => {
				const obj = {
					artist: item.artist,
					regularPrice: formatEther(item.regularPrice),
					limitedPrice: formatEther(item.limitedPrice),
					limitedSongMinted: parseInt(String(item.limitedSongMinted)),
					limitedSupply: parseInt(String(item.limitedSupply)),
					ltdSongId: parseInt(String(item.ltdSongId)),
					songId: parseInt(String(item.songId)),
					regularRevenue: parseInt(String(item.regularRevenue)),
					ltdRevenue: parseInt(String(item.ltdRevenue)),
					platformRoyality: parseInt(String(item.platformRoyality)),
					superfanRoyality: parseInt(String(item.superfanRoyality)),
					superfans: item.superfans,
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
		return allSongs;
	};

	const { address } = useAccount({
		onConnect: async ({ address }) => {
			if (songs && contract) {
				const songsOwnedCurrently = await retrieveOwnedSongs(
					address as `0x${string}`,
					songs
				);
				setOwnedSongs([...demo, ...songsOwnedCurrently]);
			}
		},

		onDisconnect: () => {
			setOwnedSongs(demo);
		},
	});

	const {
		isError,
		isLoading,
		refetch: refetchAllSongs,
	} = useContractRead({
		address: RADIOHEAD_GOERLI,
		abi: radioheadABI,
		functionName: "getSongs",
		cacheTime: 500,
		onSuccess: async (data: Song[]) => {
			const contractData = await retrieveAllSongs(data);
			setSongs(contractData);
			if (address && contractData && contract) {
				const songsOwnedCurrently = await retrieveOwnedSongs(
					address,
					contractData
				);
				setOwnedSongs([...demo, ...songsOwnedCurrently]);
			}
		},
	});

	useContractEvent({
		address: RADIOHEAD_GOERLI,
		abi: radioheadABI,
		eventName: "regularSongBought",
		listener(id) {
			toast.success(`Successfully minted the regular song of id ${id} `, {
				position: "top-center",
				autoClose: 500,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
			refetchAllSongs();
		},
		once: true,
	});

	useContractEvent({
		address: RADIOHEAD_GOERLI,
		abi: radioheadABI,
		eventName: "limitedSongBought",
		listener(id) {
			toast.success(`Successfully minted the limited song of id ${id} `, {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
			refetchAllSongs();
		},
		once: true,
	});

	useContractEvent({
		address: RADIOHEAD_GOERLI,
		abi: radioheadABI,
		eventName: "songCreated",
		listener(songId, ltdSongId) {
			toast.success(
				`Successfully created your song with songId: ${songId} and ltdSongId: ${ltdSongId}`,
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
			refetchAllSongs();
		},
		once: true,
	});

	useContractEvent({
		address: RADIOHEAD_GOERLI,
		abi: radioheadABI,
		eventName: "withdrawnFunds",
		listener(caller) {
			toast.success(
				`Successfully initiated the withdrawal of funds by ${caller}`,
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
			refetchAllSongs();
		},
		once: true,
	});

	return (
		<StateContext.Provider
			value={{ songs, setSongs, isError, isLoading, ownedSongs }}
		>
			{children}
		</StateContext.Provider>
	);
}
