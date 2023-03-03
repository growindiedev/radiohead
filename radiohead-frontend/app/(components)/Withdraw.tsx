"use client";
import { useContext } from "react";
import { StateContext } from "./StateProvider";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { formatEther } from "ethers/lib/utils.js";
import { toast } from "react-toastify";
import { abi as radioheadABI } from "../../../artifacts/contracts/Radiohead.sol/Radiohead.json";
import Loading from "../(components)/Loading";
import { RADIOHEAD_GOERLI } from "@/constants";

const Withdraw = () => {
	const { songs } = useContext(StateContext);
	const { address, isConnected } = useAccount();

	const songsCreated = songs && songs.filter((song) => song.artist === address);
	const Revenue = (() => {
		let platformRevenueTotal = 0;
		let artistRevenueTotal = 0;
		let superfanRevenueTotal = 0;

		for (let i = 0; i < songsCreated.length; i++) {
			const currentSong = songsCreated[i];
			// for regular songs
			const platformRevenueRegular =
				(currentSong.regularRevenue / 100) * currentSong.platformRoyality;
			const artistRevenueRegular =
				currentSong.regularRevenue - platformRevenueRegular;

			// for limited songs
			const platformRevenueLtd =
				(currentSong.ltdRevenue / 100) * currentSong.platformRoyality;
			const artistRevenueLtd = currentSong.ltdRevenue - platformRevenueLtd;

			//calculate the limited edition songs to superfans
			const superfans = currentSong.superfans;
			const microRevenue =
				((currentSong.regularRevenue / 100) * currentSong.superfanRoyality) /
				currentSong.limitedSupply;
			const superfanRevenue = microRevenue * superfans.length;

			// total artist revenue
			const artistRevenue =
				artistRevenueRegular + artistRevenueLtd - superfanRevenue;

			artistRevenueTotal += artistRevenue;
			superfanRevenueTotal += superfanRevenue;
			platformRevenueTotal += platformRevenueRegular + platformRevenueLtd;
			return {
				platformRevenueTotal: Number(formatEther(String(platformRevenueTotal))),
				artistRevenueTotal: Number(formatEther(String(artistRevenueTotal))),
				superfanRevenueTotal: Number(formatEther(String(superfanRevenueTotal))),
			};
		}
	})();

	const { config: regularConfig } = usePrepareContractWrite({
		address: RADIOHEAD_GOERLI,
		abi: radioheadABI,
		functionName: "withdrawRoyalities",
		enabled: isConnected,
	});

	const { isLoading, write } = useContractWrite({
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

	if (songs.length === 0) {
		return <Loading />;
	}

	return (
		<div className="grid place-items-center h-full w-full grid-rows-[1fr_3fr_1fr]">
			<div className="place-self-middle text-2xl font-bold">My Revenue</div>
			<table className="table sm:w-1/2 text-center shadow-lg">
				<thead>
					<tr>
						<th>Beneficiary</th>
						<th>Revenue</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>NFTs launched</td>
						<td>{songsCreated.length || 0}</td>
					</tr>
					<tr>
						<td>Revenue (Artist's)</td>
						<td>{Revenue?.artistRevenueTotal || 0}</td>
					</tr>
					<tr>
						<td>Platform (radiohead)</td>
						<td>{Revenue?.platformRevenueTotal || 0}</td>
					</tr>
					<tr>
						<td>Superfans</td>
						<td>{Revenue?.superfanRevenueTotal || 0}</td>
					</tr>
				</tbody>
				<tfoot>
					<tr>
						<th>Total</th>
						<th>
							{
								/* @ts-ignore */
								Revenue?.artistRevenueTotal +
									/* @ts-ignore */
									Revenue?.platformRevenueTotal +
									/* @ts-ignore */
									Revenue?.superfanRevenueTotal || 0
							}
						</th>
					</tr>
				</tfoot>
			</table>
			<button
				className={`btn btn-secondary ${isLoading && `loading`}`}
				onClick={() => write?.()}
				disabled={isLoading || !isConnected}
			>
				Withdraw
			</button>
		</div>
	);
};

export default Withdraw;
