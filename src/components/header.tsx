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
					<Button onClick={() => router.push("/")} variant={"ghost"} className="text-xl font-bold">
						StoryAI
					</Button>
					<Button onClick={() => router.push("/explore")} variant={"bordered"} className="text-xl font-semibold">Explore</Button>
				</div>
				{/* <div className="flex space-x-2 items-center">
					{status === "unauthenticated" && (
						<Button onClick={toggleAuth} variant="flat">Sign In</Button>
					)}
				</div> */}
			</div>
		</>
	);
};

export default Header;