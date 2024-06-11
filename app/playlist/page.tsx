"use client";

import { Button } from "@/components/ui/button";
import TrackArray from "@/components/ui/custom/TrackArray";
import { fakeTracks } from "@/utils/data/tracks";
import { useSession } from "next-auth/react";
import Image from "next/image";
import useSearchResultStore from "@/store/useSearchResultStore";
import { useEffect, useRef, useState } from "react";
import usePlaylistNameStore from "@/store/usePlaylistName";

export default function Home() {
	const { data: session } = useSession();
	const { searchResult } = useSearchResultStore();
	const { playlistName } = usePlaylistNameStore();

	const [showTopBar, setShowTopBar] = useState(false);
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

	return (
		<div className='flex w-full min-h-screen flex-col items-center justify-between p-4 lg:px-48 lg:py-24 '>
			<div
				className='relative w-full h-full max-h-[800px] bg-gradient-to-b from-blue-700 to-neutral-900 rounded-xl overflow-scroll'
				ref={scrollContainerRef}
			>
				{showTopBar && (
					<div className='sticky top-0 w-full z-10 flex items-center justify-between p-4 gap-4 bg-blue-700'>
						<div className='flex items-center gap-4'>
							<div className='size-8 bg-black rounded-md'></div>
							<h2 className='text-white text-3xl font-bold'>
								SpotifAI - Country Roads
							</h2>
						</div>
						<Button className='font-bold max-w-[200px]'>
							Add to Spotify
							<Image
								src='https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png'
								width={20}
								height={20}
								alt='Spotify'
								className='ml-2'
							/>
						</Button>
					</div>
				)}
				<div className='w-full h-1/3 max-h-[400px] flex items-end p-4 gap-6'>
					<div className='size-40 bg-black rounded-md'></div>
					<div className='flex flex-col gap-2'>
						<Button className='font-bold max-w-[200px]'>
							Add to Spotify
							<Image
								src='https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png'
								width={20}
								height={20}
								alt='Spotify'
								className='ml-2'
							/>
						</Button>
						<h2 className='text-white text-5xl font-bold'>
							{playlistName}
						</h2>
						<p className='text-white text-sm'>
							{searchResult.length} tracks, 10min 44s
						</p>
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
