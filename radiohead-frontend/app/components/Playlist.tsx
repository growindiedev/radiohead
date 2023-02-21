"use client";
import { useContext } from "react";
import { StateContext } from "../StateProvider";
import PlaylistSong from "./PlaylistSong";

const Playlist = ({ children }: { children: React.ReactNode }) => {
	const { songs, setSongs } = useContext(StateContext);

	return (
		<div className="drawer h-[calc(100vh-11rem)]">
			<input id="my-drawer" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content">
				<div className="h-[calc(100vh-11rem)] overflow-y-scroll">
					{children}
				</div>
			</div>
			<div className="drawer-side">
				<label htmlFor="my-drawer" className="drawer-overlay"></label>
				<ul className="menu p-4 w-80 bg-base-100 text-base-content white-player-playlist">
					<PlaylistSong />
				</ul>
			</div>
		</div>
	);
};

export default Playlist;
