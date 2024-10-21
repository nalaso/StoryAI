"use client"
import { useAuthModal } from "@/hooks/useAuthModal";
import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Header = () => {
	const router = useRouter()

	return (
		<>
			<div className="w-full bg-white flex justify-between items-center p-4">
				<div className="flex space-x-2">
					<Button onClick={() => router.push("/")} variant={"flat"} className="text-xl font-bold">
						StoryAI
					</Button>
					<Button onClick={() => router.push("/explore")} variant={"flat"} className="text-xl font-bold">Explore</Button>
				</div>
				<div className="flex space-x-2 items-center">
					<Button onClick={()=>router.push("https://github.com/nalaso/storyai")}className="text-xl font-bold" variant="flat">Github</Button>
				</div>
			</div>
		</>
	);
};

export default Header;