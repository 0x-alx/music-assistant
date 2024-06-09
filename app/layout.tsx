// app/layout.
import { TailwindIndicator } from "../components/utils/TailwindIndicator";
import { SiteConfig } from "../lib/site-config";
import { cn } from "../lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PropsWithChildren, createContext } from "react";
import { Providers } from "./Providers";
import "./globals.css";
import { Header } from "../components/layout/Header";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authConfig } from "@/lib/authConfig";
import localFont from "@next/font/local";
const calSans = localFont({
	src: [
		{
			path: "../public/fonts/CalSans-SemiBold.ttf",
			weight: "600",
		},
	],
	variable: "--font-calSans",
});

export const metadata: Metadata = {
	title: SiteConfig.title,
	description: SiteConfig.description,
};

export default async function RootLayout({ children }: PropsWithChildren) {
	const session = await getServerSession(authConfig);
	const prisma = new PrismaClient();

	const getUserInfos = async () => {
		if (session && session.user) {
			const findUserInfo = await prisma.user.findUnique({
				where: { email: session.user.email },
			});
			return findUserInfo;
		}
	};
	console.log("session", session);
	const userInfos = await getUserInfos();
	const userAccount = await prisma.account.findFirst({
		where: { userId: userInfos?.id },
	});

	// const spotifyProfile = await getSpotifyProfile({
	// 	accessToken: userAccount?.access_token!,
	// });

	return (
		<>
			<html
				lang='en'
				className='h-full'
				suppressHydrationWarning
			>
				<head />
				<body
					className={cn(
						"h-full bg-background font-sans antialiased",

						calSans.variable
					)}
				>
					<Providers>
						<div className='relative flex min-h-screen flex-col'>
							<Header />
							<div className='flex-1'>{children}</div>
						</div>
						<TailwindIndicator />
					</Providers>
				</body>
			</html>
		</>
	);
}
