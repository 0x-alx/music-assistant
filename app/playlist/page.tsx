"use client";

import { Button } from "@/components/ui/button";
import TrackArray from "@/components/ui/custom/TrackArray";
import { fakeTracks } from "@/utils/data/tracks";
import { useSession } from "next-auth/react";
import Image from "next/image";
import useSearchResultStore from "@/store/useSearchResultStore";
import { useEffect, useRef, useState } from "react";
import usePlaylistNameStore from "@/store/usePlaylistName";
import {
	addTrackToPlaylist,
	createPlaylist,
	getSpotifyProfile,
	addCustomCoverImageToPlaylist,
} from "@/utils/hooks/spotifyHooks";
import { toast } from "sonner";
import { CheckCircleIcon, Plus } from "lucide-react";

export default function Home() {
	const { data: session } = useSession();
	const { searchResult } = useSearchResultStore();
	const { playlistName } = usePlaylistNameStore();

	const [showTopBar, setShowTopBar] = useState(false);
	const [successfullAdd, setSuccessfullAdd] = useState(false);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const scrollContainer = scrollContainerRef.current;
		if (!scrollContainer) return;

		const handleScroll = () => {
			const isPastThreshold = scrollContainer.scrollTop > 200;
			setShowTopBar(isPastThreshold);
		};

		scrollContainer.addEventListener("scroll", handleScroll);

		return () => {
			scrollContainer.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const addPlaylistToSpotify = async () => {
		const spotifyProfile = await getSpotifyProfile({
			accessToken: session?.access_token!,
		});

		const playlist = await createPlaylist({
			accessToken: session?.access_token!,
			userId: spotifyProfile.id,
			name: playlistName,
		});

		const image = await addCustomCoverImageToPlaylist({
			accessToken: session?.access_token!,
			playlistId: playlist.id,
		});

		const trackListIds = searchResult.map((track: any) => track.uri);

		await addTrackToPlaylist({
			accessToken: session?.access_token!,
			playlistId: playlist.id,
			trackId: trackListIds,
		}).then(
			() => {
				setSuccessfullAdd(true);
			},
			() => {
				toast.error(
					"An error occurred while adding the playlist to Spotify"
				);
				setSuccessfullAdd(false);
			}
		);
	};

	const millisToMinutesAndSeconds = (millis: number) => {
		var minutes = Math.floor(millis / 60000);
		var seconds = Math.round((millis % 60000) / 1000);
		return seconds === 60
			? minutes + 1 + "min"
			: minutes + "min" + (seconds < 10 ? "0" : "") + seconds + "s";
	};

	return (
		<div className='flex w-full min-h-screen flex-col items-center justify-between px-4 py-24 lg:px-48 lg:py-24 '>
			<div
				className='relative w-full h-full max-h-[80vh] lg:max-h-[800px] bg-gradient-to-b from-[#F1EFE7] to-neutral-900 rounded-xl overflow-scroll'
				ref={scrollContainerRef}
			>
				{showTopBar && (
					<div className='sticky top-0 w-full z-10 flex items-center justify-between p-4 gap-4 bg-[#F1EFE7]'>
						<div className='flex items-center gap-4'>
							<div className='size-8 bg-black rounded-md'></div>
							<h2 className='text-white text-xl lg:text-3xl font-bold'>
								{playlistName}
							</h2>
						</div>
						{successfullAdd ? (
							<div className='h-9 px-4 py-2 font-bold lg:max-w-[200px] flex items-center justify-center bg-transparent border rounded-sm border-primary text-primary gap-2'>
								<CheckCircleIcon className='size-4 text-primary' />
								<span className='text-primary hidden lg:block'>
									Success
								</span>
							</div>
						) : (
							<>
								<Button
									className='font-bold max-w-[200px] hidden lg:flex'
									aria-label='Add to Spotify'
									onClick={addPlaylistToSpotify}
								>
									Add to Spotify
									<Image
										src='https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png'
										width={20}
										height={20}
										alt='Spotify'
										className='ml-2'
									/>
								</Button>
								<Button
									onClick={addPlaylistToSpotify}
									className='font-bold w-fit lg:hidden px-2'
									aria-label='Add to Spotify'
								>
									<Plus className='size-4' />
									<Image
										src='https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png'
										width={16}
										height={16}
										alt='Spotify'
										className='ml-2'
									/>
								</Button>
							</>
						)}
					</div>
				)}
				<div className='w-full h-fit lg:h-1/3 lg:max-h-[400px] flex items-center lg:items-end p-4 gap-4 lg:gap-6 bg-[url("/waves-bg.webp")] bg-cover bg-center bg-no-repeat bg-blend-overlay bg-[#00000090]'>
					<div className='size-20 min-w-20 lg:size-40 lg:min-w-40 rounded-md overflow-hidden'>
						<Image
							src='/playlist-thumbnail.jpeg'
							alt='Playlist Thumbnail'
							width={160}
							height={160}
						/>
					</div>
					<div className='flex w-full flex-col gap-2'>
						{successfullAdd ? (
							<div className='h-9 px-4 py-2 font-bold max-w-[200px] hidden lg:flex items-center justify-center bg-transparent border rounded-sm border-primary text-primary gap-2'>
								<CheckCircleIcon className='size-4 text-primary' />
								<span className='text-primary'>Success</span>
							</div>
						) : (
							<Button
								className='font-bold max-w-[200px] hidden lg:flex'
								onClick={addPlaylistToSpotify}
								aria-label='Add to Spotify'
							>
								Add to Spotify
								<Image
									src='https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png'
									width={20}
									height={20}
									alt='Spotify'
									className='ml-2'
								/>
							</Button>
						)}
						<h2 className='text-white text-2xl lg:text-5xl font-bold'>
							{playlistName}
						</h2>
						<div className='flex items-center justify-between'>
							<p className='text-white text-sm'>
								{searchResult.length} tracks -{" "}
								{millisToMinutesAndSeconds(
									searchResult.reduce(
										(
											acc: any,
											track: { duration_ms: any }
										) => acc + track.duration_ms,
										0
									)
								)}
							</p>
							{successfullAdd ? (
								<div className='h-9 px-4 py-2 font-bold lg:hidden flex items-center justify-center bg-transparent border rounded-sm border-primary text-primary gap-2'>
									<CheckCircleIcon className='size-4 text-primary' />
									<span className='text-primary hidden lg:block'>
										Success
									</span>
								</div>
							) : (
								<Button
									className='font-bold w-fit lg:hidden px-2'
									onClick={addPlaylistToSpotify}
									aria-label='Add to Spotify'
								>
									<Plus className='size-4' />
									<Image
										src='https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png'
										width={16}
										height={16}
										alt='Spotify'
										className='ml-2'
									/>
								</Button>
							)}
						</div>
					</div>
				</div>
				<div className='w-full backdrop-blur-sm bg-black/30 p-4'>
					<div className='flex flex-col gap-4'>
						<TrackArray
							data={searchResult}
							isLoading={false}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
