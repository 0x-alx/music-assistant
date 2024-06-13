"use client";
import React, { useState } from "react";
import { Button } from "../button";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoaderCircle } from "lucide-react";

const LoginButton = () => {
	const { data: session, status } = useSession();

	const connectToSpotify = async () => {
		await signIn("spotify").then(() => {});
	};

	if (session) {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Avatar>
						<AvatarImage src={session?.user?.image || ""} />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={async () => {
							await signOut();
						}}
						className='cursor-pointer text-red-500'
					>
						Logout
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	} else {
		return (
			<Button
				aria-label='Connect to Spotify'
				onClick={connectToSpotify}
				className='font-bold'
			>
				{status === "loading" ? "Connecting" : "Spotify Connect"}
				{status === "loading" && (
					<LoaderCircle className='ml-2 h-4 w-4 animate-spin' />
				)}
				{status === "unauthenticated" && (
					<Image
						src='https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png'
						width={20}
						height={20}
						alt='Spotify'
						className='ml-2'
					/>
				)}
			</Button>
		);
	}
};

export default LoginButton;
