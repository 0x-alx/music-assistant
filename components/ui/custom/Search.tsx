"use client";
import React, { useContext, useState } from "react";
import { Input } from "../input";
import { Button } from "../button";
import { OpenAI } from "openai";
import { getTracks, searchSpotifyTrack } from "@/utils/hooks/spotifyHooks";
import useSearchResultStore from "@/store/useSearchResultStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import usePlaylistNameStore from "@/store/usePlaylistName";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

const Search = () => {
	const { data: session } = useSession();
	const openai = new OpenAI({
		apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
		dangerouslyAllowBrowser: true,
	});
	const { setSearchResult, isLoading, setIsLoading } =
		useSearchResultStore() as {
			setSearchResult: (searchResult: any) => void;
			setIsLoading: (isLoading: boolean) => void;
			isLoading: boolean;
		};
	const { setPlaylistName } = usePlaylistNameStore() as {
		setPlaylistName: (playlistName: string) => void;
	};
	const router = useRouter();
	const [value, setValue] = useState("");
	const [tracksInfos, setTracksInfos] = useState([]);

	// const [playlistName, setPlaylistName] = useState("");
	const [displayArray, setDisplayArray] = useState(false);

	const generatePrompt = () => {
		return `Suggest me 15 tracks. Context: ${value}. You must generate a public name for this playlist, and provide me with your answer in the following JSON format: {playlistName: 'playlistName', titles: [{title: 'title', artist: 'artist'}]}`;
	};

	const generatePlaylist = async () => {
		setDisplayArray(true);
		const prompt = generatePrompt();

		setIsLoading(true);

		const GPTResponse = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content:
						"You are a music suggester. You love music, and you love to advice people about it. ",
				},
				{
					role: "user",
					content: prompt,
				},
			],
			response_format: { type: "json_object" },
		});

		const GPTGeneratedTracklist = JSON.parse(
			GPTResponse.choices[0].message.content!
		);

		setPlaylistName(GPTGeneratedTracklist.playlistName);
		let trackListIds: string[] = [];

		const trackSearchPromises = GPTGeneratedTracklist.titles.map(
			async (track: any) => {
				const result = await searchSpotifyTrack({
					accessToken: session?.access_token!,
					query: track.title + " " + track.artist,
				});
				if (result.tracks.items.length === 0) {
					toast.error("Track not found", {
						description: `${track.title} - ${track.artist}`,
					});
				} else {
					trackListIds.push(result.tracks.items[0].id);
				}
			}
		);

		await Promise.all(trackSearchPromises);

		const tracksInformations = await getTracks({
			accessToken: session?.access_token!,
			trackIds: trackListIds,
		});
		setSearchResult(tracksInformations.tracks);
		router.push("/playlist");
		setIsLoading(false);
	};

	return (
		<div className='flex w-full flex-col gap-4 self-center lg:flex-row bg-gray-100 p-2 rounded-md max-w-[500px]'>
			<Input
				value={value}
				onChange={(e) => setValue(e.target.value)}
				type='text'
				placeholder='I need a playlist for a BBQ party...'
				className='w-full border-none outline-none shadow-none focus:outline-none focus-visible:ring-0 focus:border-none text-black'
			/>
			<Button
				aria-label='Generate playlist'
				onClick={generatePlaylist}
				disabled={isLoading || !session?.access_token}
			>
				{isLoading ? "Generating" : "Generate"}
				{isLoading && (
					<LoaderCircle className='ml-2 h-4 w-4 animate-spin' />
				)}
			</Button>
		</div>
	);
};

export default Search;
