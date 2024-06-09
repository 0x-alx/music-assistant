import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/authConfig";
import { getSpotifyProfile } from "@/utils/hooks/spotifyHooks";
import Frame from "./Frame";
import React from "react";
import useSearchResultStore from "@/store/useSearchResultStore";

const Home = async () => {
	// const session = await getServerSession(authConfig);
	// const prisma = new PrismaClient();

	// const getUserInfos = async () => {
	// 	if (session && session.user) {
	// 		const findUserInfo = await prisma.user.findUnique({
	// 			where: { email: session.user.email },
	// 		});
	// 		return findUserInfo;
	// 	}
	// };

	// const userInfos = await getUserInfos();
	// const userAccount = await prisma.account.findFirst({
	// 	where: { userId: userInfos?.id },
	// });

	// const spotifyProfile = await getSpotifyProfile({
	// 	accessToken: userAccount?.access_token!,
	// });

	return (
		<>
			<Frame />
		</>
	);
};

export default Home;
