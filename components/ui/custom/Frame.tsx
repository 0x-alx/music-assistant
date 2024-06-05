"use client";

import { useState } from "react";
import { Input } from "../input";
import { Button } from "../button";
import { Toaster } from "../sonner";
import { toast } from "sonner";

import { OpenAI } from "openai";
import {
	addTrackToPlaylist,
	createPlaylist,
	getSpotifyProfile,
	getTracks,
	searchSpotifyTrack,
} from "../../../utils/hooks/spotifyHooks";

import data from "../../../utils/data/tracks.json";
import TrackArray from "./TrackArray";
import { Slider } from "../slider";
import { Badge } from "../badge";
import { styleList } from "../../../utils/data/styleList";
import { musicFeels } from "../../../utils/data/musicFeels";
import Image from "next/image";
import { X } from "lucide-react";

const Frame = ({ userAccount }: { userAccount: any }) => {
	const openai = new OpenAI({
		apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
		dangerouslyAllowBrowser: true,
	});
	const [tracksInfos, setTracksInfos] = useState([]);
	const [prompt, setPrompt] = useState("");
	const [loading, setLoading] = useState(false);
	const [playlistName, setPlaylistName] = useState("");
	const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
	const [selectedFeels, setSelectedFeels] = useState<string[]>([]);
	const [hovered, setIsHovered] = useState("");

	const generatePrompt = () => {
		return `Suggest me 10 tracks. ${
			selectedStyles.length > 0
				? "Music style: " + selectedStyles.join(", ") + "."
				: ""
		} ${
			selectedFeels.length > 0
				? "Music feel: " + selectedFeels.join(", ") + "."
				: ""
		} Context: ${prompt}. You must generate a public name for this playlist, and provide me with your answer in the following JSON format: {playlistName: 'playlistName', titles: [{title: 'title', artist: 'artist'}]}`;
	};

	const generatePlaylist = async () => {
		const prompt = generatePrompt();
		console.log(prompt);
		setLoading(true);

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
					accessToken: userAccount?.access_token!,
					query: track.title + " " + track.artist,
				});
				trackListIds.push(result.tracks.items[0].id);
			}
		);

		await Promise.all(trackSearchPromises);

		const tracksInformations = await getTracks({
			accessToken: userAccount?.access_token!,
			trackIds: trackListIds,
		});
		console.log(tracksInformations.tracks);
		setTracksInfos(tracksInformations.tracks);
		setLoading(false);
	};

	const addPlaylistToSpotify = async () => {
		const spotifyProfile = await getSpotifyProfile({
			accessToken: userAccount?.access_token!,
		});

		const playlist = await createPlaylist({
			accessToken: userAccount?.access_token!,
			userId: spotifyProfile.id,
			name: "SpotifAI - " + playlistName,
		});

		const trackListIds = tracksInfos.map((track: any) => track.uri);

		await addTrackToPlaylist({
			accessToken: userAccount?.access_token!,
			playlistId: playlist.id,
			trackId: trackListIds,
		}).then(
			() => {
				toast("Playlist successfully added to Spotify");
			},
			() => {
				toast("An error occurred while adding the playlist to Spotify");
			}
		);
	};

	function millisToMinutesAndSeconds(millis: number) {
		var minutes = Math.floor(millis / 60000);
		var seconds = Math.round((millis % 60000) / 1000);
		return seconds === 60
			? minutes + 1 + ":00"
			: minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
	}
	return (
		<div className='flew-wrap z-10 flex w-full max-w-[80%] flex-col items-start justify-between gap-8 font-mono text-sm lg:flex'>
			<Toaster />
			<div>
				<h1 className='text-2xl font-bold'>SpotifAI</h1>
				<p className='text-sm'>
					Your personalized playlist, generated by GPT-3.5
				</p>
			</div>
			<div className='flex w-full flex-col gap-4 self-center lg:flex-row'>
				<Input
					type='text'
					placeholder='Context: I need a playlist for a BBQ party...'
					className='w-full'
					onChange={(e) => setPrompt(e.target.value)}
				/>
				<Button onClick={generatePlaylist}>Generate</Button>
			</div>
			<Slider
				defaultValue={[10]}
				min={1}
				max={20}
			/>
			<div className='flex w-full gap-4 flex-wrap md:flex-nowrap'>
				<div className='relative flex w-full border p-6 rounded-md flex-wrap gap-2 md:max-w-[50%] '>
					<div className='absolute -top-3 left-4 z-10 bg-primary-foreground rounded-md px-2 py-1 text-xs'>
						<p className='text-sm'>Feel</p>
					</div>
					{musicFeels.map((feel: any) => (
						<Badge
							key={feel}
							onClick={() =>
								!selectedFeels.includes(feel)
									? setSelectedFeels([...selectedFeels, feel])
									: setSelectedFeels((oldValues) => {
											return oldValues.filter(
												(feeling) => feeling !== feel
											);
									  })
							}
							variant={
								selectedFeels.includes(feel)
									? "default"
									: "outline"
							}
							className='flex cursor-pointer w-fit items-center justify-center gap-1'
							onMouseEnter={() => setIsHovered(feel)}
							onMouseLeave={() => setIsHovered("")}
						>
							{feel}
							{selectedFeels.includes(feel) &&
								hovered === feel && <X size={12} />}
						</Badge>
					))}
				</div>
				<div className='relative flex w-full border p-6 rounded-md flex-wrap gap-2 md:max-w-[50%]'>
					<div className='absolute -top-3 left-4 z-10 px-2 py-1 text-xs bg-primary-foreground rounded-md'>
						<p className='text-sm'>Style</p>
					</div>
					{styleList.map((style: any) => (
						<Badge
							key={style}
							onClick={() =>
								!selectedStyles.includes(style)
									? setSelectedStyles([
											...selectedStyles,
											style,
									  ])
									: setSelectedStyles((oldValues) => {
											return oldValues.filter(
												(music_style) =>
													music_style !== style
											);
									  })
							}
							variant={
								selectedStyles.includes(style)
									? "default"
									: "outline"
							}
							className='flex cursor-pointer w-fit items-center justify-center gap-1'
							onMouseEnter={() => setIsHovered(style)}
							onMouseLeave={() => setIsHovered("")}
						>
							{style}
							{selectedStyles.includes(style) &&
								hovered === style && <X size={12} />}
						</Badge>
					))}
				</div>
			</div>

			<div className='flex w-full flex-wrap self-center'>
				<div className='flex w-full gap-4'>
					<div className='flex flex-col gap-2'>
						<h1 className='text-2xl font-bold'>{playlistName}</h1>
						{tracksInfos.length > 0 && (
							<p className='text-sm'>
								{tracksInfos.length} tracks
							</p>
						)}
					</div>
					{tracksInfos.length > 0 && (
						<Button
							onClick={addPlaylistToSpotify}
							className='font-bold'
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
				</div>
				<TrackArray
					data={tracksInfos}
					isLoading={loading}
				/>
			</div>
		</div>
	);
};

export default Frame;
