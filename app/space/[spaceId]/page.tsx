import React from "react";
import RightSideBar from "@components/space/RightSideBar";
import BottomBar from "@components/space/BottomBar";

const SpacePage = () => {
	return (
		<div className="flex h-screen overflow-hidden">
			<main className="flex-grow flex flex-col overflow-hidden">
				<div className="flex-grow relative">
					<div className="absolute inset-0 p-6">
						<div>
							<iframe
								className="absolute inset-0 w-full h-full"
								title="vnc"
								src="https://vnc-socket-2.fly.dev/ "
							/>
						</div>
						<div className="space-y-4" />
					</div>
				</div>

				<BottomBar />
			</main>

			<RightSideBar />
		</div>
	);
};

export default SpacePage;
