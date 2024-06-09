"use client";
import Search from "@/components/ui/custom/Search";
import React, { createContext, useEffect } from "react";
import { useTheme } from "next-themes";
import TrackArray from "@/components/ui/custom/TrackArray";
import useSearchResultStore from "@/store/useSearchResultStore";
import { fakeTracks } from "@/utils/data/tracks";

const Frame = () => {
	const { theme } = useTheme();

	const shadow =
		theme === "dark"
			? "shadow-[inset_0px_-150px_60px_0px_#1D1D1D]"
			: "shadow-[inset_0px_-150px_60px_0px_#FFFFFF]";

	const { searchResult, isLoading } = useSearchResultStore() as {
		searchResult: any;
		isLoading: boolean;
	};

	return (
		<div className='flex flex-col w-full items-center justify-center min-h-screen bg-background'>
			<div className='relative flex w-3/4 flex-col items-center justify-center gap-10'>
				<div
					className={`absolute size-72 -top-[194px] mx-auto bg-[url("https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png")] bg-cover ${shadow}`}
				></div>
				<h2 className='text-secondary-foreground text-7xl font-bold text-center z-10 bg-background font-sans'>
					AI generated playlist <br /> depending on your mood
				</h2>
				<Search />
				<p className='text-neutral-300 text-sm font-bold text-center z-10 bg-background'>
					Powered by ChatGPT-3.5
				</p>
			</div>
		</div>
	);
};

export default Frame;
