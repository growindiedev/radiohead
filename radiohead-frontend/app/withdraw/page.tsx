"use client";
import { useContext } from "react";
import { StateContext } from "../StateProvider";
import { useAccount } from "wagmi";
import { formatEther } from "ethers/lib/utils.js";

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

	if (songs.length === 0) {
		return <div>loading...</div>;
	}

	return (
		<div className="grid place-items-center h-full w-full grid-rows-[1fr_3fr_1fr]">
			<div className="place-self-middle tex font-bold">My Revenue</div>
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
						<td>{Revenue?.artistRevenueTotal}</td>
					</tr>
					<tr>
						<td>Platform (radiohead)</td>
						<td>{Revenue?.platformRevenueTotal}</td>
					</tr>
					<tr>
						<td>Superfans</td>
						<td>{Revenue?.superfanRevenueTotal}</td>
					</tr>
				</tbody>
				<tfoot>
					<tr>
						<th>Total</th>
						<th>
							{Revenue?.artistRevenueTotal +
								Revenue?.platformRevenueTotal +
								Revenue?.superfanRevenueTotal}
						</th>
					</tr>
				</tfoot>
			</table>
			<button className="btn btn-secondary">Withdraw</button>
		</div>
	);
};

export default Withdraw;
