import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import CreateSpaceButton from "@components/dashboard/CreateSpaceButton";
import { SpaceComponent } from "@components/dashboard/SpaceComponent";
import InviteContainer from "./InviteContainer";
import UserSpaces from "./MySpaces";

interface SpaceContainerProps {
	link?: string;
	members: number;
	screen: string;
	pfp: string;
	realUsername: string;
}

const SpaceContainer: React.FC<SpaceContainerProps> = ({
	link,
	members,
	screen,
	pfp,
	realUsername,
}) => {
	return (
		<main className="flex-1 p-6 relative">
			<h1 className="text-5xl font-bold mb-6 mt-5">
				{`${realUsername}'s`} Spaces
			</h1>
			<div className="absolute top-10 right-11">
				<Link href="/profile">
					<CgProfile className="text-5xl cursor-pointer" />
				</Link>
			</div>

			<div className="">
				<UserSpaces />
			</div>

			<h1 className="text-5xl font-bold mb-5 mt-5">Recent Spaces</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
				<div className="col-span-1">
					<InviteContainer />
				</div>
				<Link href="/space/id" className="col-span-1">
					<SpaceComponent members={members} screen={screen} pfp={pfp} />
				</Link>
			</div>
		</main>
	);
};

export default SpaceContainer;
