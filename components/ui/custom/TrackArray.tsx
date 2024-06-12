"use client";
import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TableHeader,
} from "../table";
import Image from "next/image";
import { Skeleton } from "../skeleton";
import { Play, Pause } from "lucide-react";

const TrackArray = ({ data, isLoading }: { data: any; isLoading: boolean }) => {
	const [selectedTrack, setSelectedTrack] = useState<any>(null);
	const [playingTrack, setPlayingTrack] = useState<any>(null);

	const handleMouseEnter = (track: any) => {
		setSelectedTrack(track);
	};

	const DisplayPlayButton = (track: any, index: number) => {
		if (playingTrack?.id === track.id) {
			return <Pause className='size-[14px]' />;
		} else if (selectedTrack?.id === track.id) {
			return <Play className='size-[14px]' />;
		} else {
			return <p className='text-sm min-w-[14px]'>{index + 1}</p>;
		}
	};

	const handlePlay = (track: any) => {
		setPlayingTrack(track);
		if (playingTrack?.id === track.id) {
			if (playingTrack.audio) {
				playingTrack.audio.pause();
				setPlayingTrack(null);
			}
		} else {
			if (playingTrack?.audio) {
				playingTrack.audio.pause();
			}
			const audio = new Audio(track.preview_url);
			audio.play();
			setPlayingTrack({ ...track, audio });
		}
	};

	return (
		<div>
			<Table className='w-full'>
				<TableHeader>
					<TableRow>
						<TableHead>#</TableHead>
						<TableHead>Titre</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody className='overflow-y-scroll'>
					{!isLoading &&
						data.map((track: any, index: number) => (
							<TableRow
								className={`${
									playingTrack?.id === track.id &&
									"bg-muted/50"
								} cursor-pointer text-white`}
								key={track.id}
								onMouseEnter={() => handleMouseEnter(track)}
								onMouseLeave={() => setSelectedTrack(null)}
								onClick={() => handlePlay(track)}
							>
								<TableCell>
									{DisplayPlayButton(track, index)}
								</TableCell>
								<TableCell className='flex flex-row gap-2'>
									<Image
										src={track.album.images[0].url}
										alt={track.name}
										width={50}
										height={50}
										className='rounded-md'
									/>
									<div className='truncate flex flex-col'>
										<a
											href={track.external_urls.spotify}
											target='_blank'
											rel='noreferrer'
											className='text-sm hover:underline'
										>
											{track.name}
										</a>
										<a
											href={
												track.artists[0].external_urls
													.spotify
											}
											target='_blank'
											rel='noreferrer'
											className='text-xs hover:underline'
										>
											{track.artists[0].name}
										</a>
									</div>
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
		</div>
	);
};

export default TrackArray;
