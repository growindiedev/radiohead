export type Song = {
	artist: string;
	regularPrice: string;
	limitedPrice: string;
	limitedSongMinted: number;
	limitedSupply: number;
	ltdSongId: number;
	songId: number;
};

export type metadata = {
	description: string;
	name: string;
	attributes: [
		{
			trait_type: string;
			value: string;
		}
	];
	image: string;
	animation_url: string;
};

export type songWithMetadata = {
	image: string;
	animation_url: string;
	description: string;
	name: string;
	attributes: [
		{
			trait_type: string;
			value: string;
		}
	];
	artist: string;
	regularPrice: string;
	limitedPrice: string;
	limitedSongMinted: number;
	limitedSupply: number;
	ltdSongId: number;
	songId: number;
};

export type songsOwnedByUser = {
	image: string;
	animation_url: string;
	description: string;
	name: string;
	attributes: [
		{
			trait_type: string;
			value: string;
		}
	];
	artist: string;
	regularPrice: string;
	limitedPrice: string;
	limitedSongMinted: number;
	limitedSupply: number;
	ltdSongId: number;
	songId: number;
	regularSongBalance: number;
	ltdSongBalance: number;
};

export type FormValues = {
	limitedEditionSupply: string;
	regularEditionPrice: string;
	limitedEditionPrice: string;
	platformRoyality: string;
	superfansRoyality: string;
	coverArt: File;
	audio: File;
};
