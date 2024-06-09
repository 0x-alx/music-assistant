"use client";
import React from "react";
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
import useSearchResultStore from "@/store/useSearchResultStore";

const LoginButton = () => {
	const { data: session } = useSession();

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
				onClick={async () => await signIn("spotify")}
				className='font-bold'
			>
				Spotify Connect
				<Image
					src='https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png'
					width={20}
					height={20}
					alt='Spotify'
					className='ml-2'
				/>
			</Button>
		);
	}
};

export default LoginButton;
