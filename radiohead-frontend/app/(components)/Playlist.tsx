"use client";
import { useContext } from "react";
import { StateContext } from "../StateProvider";
import PlaylistSong from "./PlaylistSong";
import { ToastContainer, Slide } from "react-toastify";

const Playlist = ({ children }: { children: React.ReactNode }) => {
	const { ownedSongs } = useContext(StateContext);
	return (
		<div className="drawer max-h-[calc(100vh-16.6rem)] sm:max-h-[calc(100vh-11.6rem)]">
			<input id="my-drawer" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content max-h-[calc(100vh-16.6rem)] sm:max-h-[calc(100vh-11.6rem)]">
				{children}
				<ToastContainer position="top-center" transition={Slide} />
			</div>
			<div className="drawer-side">
				<label htmlFor="my-drawer" className="drawer-overlay"></label>
				<ul className="menu p-4 w-96 bg-base-100 text-base-content white-player-playlist">
					<div className="bg-base-200 glass px-6 font-semibold mx-auto mb-2">
						💀🎧 My Tunes 🎵📻
					</div>
					{ownedSongs.length > 0 &&
						ownedSongs.map((song, i) => (
							<PlaylistSong key={song.songId} {...song} index={i} />
						))}
				</ul>
			</div>
		</div>
	);
};

export default Playlist;
