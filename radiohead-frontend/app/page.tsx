"use client";

import { StateContext } from "./StateProvider";
import { useContext } from "react";
import SongCard from "./components/SongCard";
import Loading from "./components/Loading";

const Home = () => {
	const { songs, isLoading, isError } = useContext(StateContext);
	if (songs.length == 0 || isLoading) return <Loading />;
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
