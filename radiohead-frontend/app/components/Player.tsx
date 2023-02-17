"use client";
import React, { useEffect } from "react";
import Amplitude from "amplitudejs";

const Player = () => {
	const playlist = [
		{
			name: "Risin' High (feat Raashan Ahmad)",
			artist: "Ancient Astronauts",
			album: "We Are to Answer",
			url: "https://521dimensions.com/songs/Ancient Astronauts - Risin' High (feat Raashan Ahmad).mp3",
			cover_art_url:
				"https://521dimensions.com/img/open-source/amplitudejs/album-art/we-are-to-answer.jpg",
		},
		{
			name: "The Gun",
			artist: "Lorn",
			album: "Ask The Dust",
			url: "https://521dimensions.com/songs/08 The Gun.mp3",
			cover_art_url:
				"https://521dimensions.com/img/open-source/amplitudejs/album-art/ask-the-dust.jpg",
		},
		{
			name: "Anvil",
			artist: "Lorn",
			album: "Anvil",
			url: "https://521dimensions.com/songs/LORN - ANVIL.mp3",
			cover_art_url:
				"https://521dimensions.com/img/open-source/amplitudejs/album-art/anvil.jpg",
		},
		{
			name: "I Came Running",
			artist: "Ancient Astronauts",
			album: "We Are to Answer",
			url: "https://521dimensions.com/songs/ICameRunning-AncientAstronauts.mp3",
			cover_art_url:
				"https://521dimensions.com/img/open-source/amplitudejs/album-art/we-are-to-answer.jpg",
		},
		{
			name: "First Snow",
			artist: "Emancipator",
			album: "Soon It Will Be Cold Enough",
			url: "https://521dimensions.com/songs/FirstSnow-Emancipator.mp3",
			cover_art_url:
				"https://521dimensions.com/img/open-source/amplitudejs/album-art/soon-it-will-be-cold-enough.jpg",
		},
		{
			name: "Terrain",
			artist: "pg.lost",
			album: "Key",
			url: "https://521dimensions.com/songs/Terrain-pglost.mp3",
			cover_art_url:
				"https://521dimensions.com/img/open-source/amplitudejs/album-art/key.jpg",
		},
		{
			name: "Vorel",
			artist: "Russian Circles",
			album: "Guidance",
			url: "https://521dimensions.com/songs/Vorel-RussianCircles.mp3",
			cover_art_url:
				"https://521dimensions.com/img/open-source/amplitudejs/album-art/guidance.jpg",
		},
		{
			name: "Intro / Sweet Glory",
			artist: "Jimkata",
			album: "Die Digital",
			url: "https://521dimensions.com/songs/IntroSweetGlory-Jimkata.mp3",
			cover_art_url:
				"https://521dimensions.com/img/open-source/amplitudejs/album-art/die-digital.jpg",
		},
		{
			name: "Offcut #6",
			artist: "Little People",
			album: "We Are But Hunks of Wood Remixes",
			url: "https://521dimensions.com/songs/Offcut6-LittlePeople.mp3",
			cover_art_url:
				"https://521dimensions.com/img/open-source/amplitudejs/album-art/we-are-but-hunks-of-wood.jpg",
		},
		{
			name: "Dusk To Dawn",
			artist: "Emancipator",
			album: "Dusk To Dawn",
			url: "https://521dimensions.com/songs/DuskToDawn-Emancipator.mp3",
			cover_art_url:
				"https://521dimensions.com/img/open-source/amplitudejs/album-art/from-dusk-to-dawn.jpg",
		},
		{
			name: "Anthem",
			artist: "Emancipator",
			album: "Soon It Will Be Cold Enough",
			url: "https://521dimensions.com/songs/Anthem-Emancipator.mp3",
			cover_art_url:
				"https://521dimensions.com/img/open-source/amplitudejs/album-art/soon-it-will-be-cold-enough.jpg",
		},
	];

	useEffect(() => {
		Amplitude.init({
			songs: playlist,
		});
	}, []);

	/*
  Shows the playlist
*/
	// 	document
	// 		.getElementsByClassName("show-playlist")[0]
	// 		.addEventListener("click", function () {
	// 			document
	// 				.getElementById("white-player-playlist-container")
	// 				.classList.remove("slide-out-top");
	// 			document
	// 				.getElementById("white-player-playlist-container")
	// 				.classList.add("slide-in-top");
	// 			document.getElementById("white-player-playlist-container").style.display =
	// 				"block";
	// 		});

	// 	/*
	//   Hides the playlist
	// */
	// 	document
	// 		.getElementsByClassName("close-playlist")[0]
	// 		.addEventListener("click", function () {
	// 			document.getElementById("white-player-playlist-container")
	// 				.classList.remove("slide-in-top");
	// 			document
	// 				.getElementById("white-player-playlist-container")
	// 				.classList.add("slide-out-top");
	// 			document.getElementById("white-player-playlist-container").style.display =
	// 				"none";
	// 		});

	return (
		// <div className="example-container">
		// <div className="left">
		<div id="white-player">
			<div className="white-player-top">
				<div>&nbsp;</div>

				<div className="center">
					<span className="now-playing">Now Playing</span>
				</div>

				<div>
					<img
						src="https://521dimensions.com/img/open-source/amplitudejs/examples/dynamic-songs/show-playlist.svg"
						className="show-playlist"
					/>
				</div>
			</div>

			<div id="white-player-center">
				<img
					data-amplitude-song-info="cover_art_url"
					className="main-album-art"
				/>

				<div className="song-meta-data">
					<span data-amplitude-song-info="name" className="song-name"></span>
					<span
						data-amplitude-song-info="artist"
						className="song-artist"
					></span>
				</div>

				<div className="time-progress">
					<div id="progress-container">
						<input type="range" className="amplitude-song-slider" />
						<progress
							id="song-played-progress"
							className="amplitude-song-played-progress"
						></progress>
						<progress
							id="song-buffered-progress"
							className="amplitude-buffered-progress"
							value="0"
						></progress>
					</div>

					<div className="time-container">
						<span className="current-time">
							<span className="amplitude-current-minutes"></span>:
							<span className="amplitude-current-seconds"></span>
						</span>
						<span className="duration">
							<span className="amplitude-duration-minutes"></span>:
							<span className="amplitude-duration-seconds"></span>
						</span>
					</div>
				</div>
			</div>

			<div id="white-player-controls">
				<div
					className="amplitude-shuffle amplitude-shuffle-off"
					id="shuffle"
				></div>
				<div className="amplitude-prev" id="previous"></div>
				<div className="amplitude-play-pause" id="play-pause"></div>
				<div className="amplitude-next" id="next"></div>
				<div className="amplitude-repeat" id="repeat"></div>
			</div>

			<div id="white-player-playlist-container">
				<div className="white-player-playlist-top">
					<div></div>
					<div>
						<span className="queue">Queue</span>
					</div>
					<div>
						<img
							src="https://521dimensions.com/img/open-source/amplitudejs/examples/dynamic-songs/close.svg"
							className="close-playlist"
						/>
					</div>
				</div>

				<div className="white-player-up-next">Up Next</div>

				<div className="white-player-playlist">
					<div
						className="white-player-playlist-song amplitude-song-container amplitude-play-pause"
						data-amplitude-song-index="0"
					>
						<img src="https://521dimensions.com/img/open-source/amplitudejs/album-art/we-are-to-answer.jpg" />

						<div className="playlist-song-meta">
							<span className="playlist-song-name">
								Risin' High (feat Raashan Ahmad)
							</span>
							<span className="playlist-artist-album">
								Ancient Astronauts &bull; We Are to Answer
							</span>
						</div>
					</div>
					<div
						className="white-player-playlist-song amplitude-song-container amplitude-play-pause"
						data-amplitude-song-index="1"
					>
						<img src="https://521dimensions.com/img/open-source/amplitudejs/album-art/ask-the-dust.jpg" />

						<div className="playlist-song-meta">
							<span className="playlist-song-name">The Gun</span>
							<span className="playlist-artist-album">
								Lorn &bull; Ask The Dust
							</span>
						</div>
					</div>
					<div
						className="white-player-playlist-song amplitude-song-container amplitude-play-pause"
						data-amplitude-song-index="2"
					>
						<img src="https://521dimensions.com/img/open-source/amplitudejs/album-art/anvil.jpg" />

						<div className="playlist-song-meta">
							<span className="playlist-song-name">The Gun</span>
							<span className="playlist-artist-album">Lorn &bull; Anvil</span>
						</div>
					</div>
					<div
						className="white-player-playlist-song amplitude-song-container amplitude-play-pause"
						data-amplitude-song-index="3"
					>
						<img src="https://521dimensions.com/img/open-source/amplitudejs/album-art/we-are-to-answer.jpg" />

						<div className="playlist-song-meta">
							<span className="playlist-song-name">I Came Running</span>
							<span className="playlist-artist-album">
								Ancient Astronauts &bull; We Are to Answer
							</span>
						</div>
					</div>
					<div
						className="white-player-playlist-song amplitude-song-container amplitude-play-pause"
						data-amplitude-song-index="4"
					>
						<img src="https://521dimensions.com/img/open-source/amplitudejs/album-art/soon-it-will-be-cold-enough.jpg" />

						<div className="playlist-song-meta">
							<span className="playlist-song-name">First Snow</span>
							<span className="playlist-artist-album">
								Emancipator &bull; Soon It Will Be Cold Enough
							</span>
						</div>
					</div>
				</div>

				<div className="white-player-playlist-controls">
					<img
						data-amplitude-song-info="cover_art_url"
						className="playlist-album-art"
					/>

					<div className="playlist-controls">
						<div className="playlist-meta-data">
							<span
								data-amplitude-song-info="name"
								className="song-name"
							></span>
							<span
								data-amplitude-song-info="artist"
								className="song-artist"
							></span>
						</div>

						<div className="playlist-control-wrapper">
							<div className="amplitude-prev" id="playlist-previous"></div>
							<div
								className="amplitude-play-pause"
								id="playlist-play-pause"
							></div>
							<div className="amplitude-next" id="playlist-next"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		// </div>
		// </div>
	);
};

export default Player;
