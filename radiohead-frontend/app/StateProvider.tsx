"use client";

import { createContext, Dispatch, SetStateAction, useState } from "react";
import { Song, metadata, finalSong } from "@/types";

export type contextType = {
	songs: finalSong[] | undefined;
	setSongs: Dispatch<SetStateAction<any>>;
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
	return (
		<StateContext.Provider value={{ songs, setSongs }}>
			{children}
		</StateContext.Provider>
	);
}
