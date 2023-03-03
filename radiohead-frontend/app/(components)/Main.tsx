"use client";

import { StateContext } from "./StateProvider";
import { useContext } from "react";
import SongCard from "./SongCard";
import Loading from "./Loading";

const Main = () => {
	const { songs, isLoading, isError } = useContext(StateContext);
	if (songs.length == 0 || isLoading) return <Loading />;
	if (isError)
		return (
			<div className="grid place-items-center w-full h-full">
				Error fetching the data
			</div>
		);
	return (
		<div className="grid gap-6 grid-cols-[repeat(auto-fill,_minmax(220px,_1fr))] my-6 md:mx-[15%] sm:mx-6">
			{songs.map((song, i) => (
				<SongCard key={i} {...song} />
			))}
		</div>
	);
};

export default Main;
