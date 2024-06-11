// src/components/layout/Header.
import { SiteConfig } from "@/lib/site-config";
import Link from "next/link";
import { ThemeToggle } from "../theme/ThemeToggle";
import LoginButton from "../ui/custom/LoginButton";

export function Header() {
	return (
		<header className='fixed top-0 z-40 w-full'>
			<div className='container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0'>
				<div className='flex gap-6 md:gap-10 text-white'>
					<Link href='/'>
						<h3>{SiteConfig.title}</h3>
					</Link>
				</div>

				<div className='flex flex-1 items-center justify-end space-x-4'>
					<nav className='flex items-center gap-4 space-x-1'>
						<LoginButton />
						<ThemeToggle />
					</nav>
				</div>
			</div>
		</header>
	);
}
