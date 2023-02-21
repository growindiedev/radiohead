"use client";

import { StateContext } from "./StateProvider";
import { useContext } from "react";
import SongCard from "./components/SongCard";

const Home = () => {
	// const { isConnected } = useAccount();
	const { songs, isLoading, isError } = useContext(StateContext);

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
