"use client";

import { useState, useEffect } from "react";
import { useUser } from "@stackframe/stack";
import { ServiceMethods } from "@lib/servicesMethods";
import LoadingSpinner from "@components/ui/Spiner";


interface VncDisplayProps {
	spaceId: string;
}

const VncDisplay: React.FC<VncDisplayProps> = ({ spaceId }) => {
	const user = useUser({ or: "redirect" });
	const [flyUrl, setFlyUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;
		let timeoutId: NodeJS.Timeout;

		const fetchSpaceData = async () => {
			if (!isMounted || flyUrl) return; // Stop if component is unmounted or we already have a flyUrl


			try {
				const { accessToken, refreshToken } = await user.getAuthJson();
				if (!accessToken || !refreshToken) {
					throw new Error(
						"Access/refresh token are required for the ServiceMethods",
					);
				}

				const serviceMethods = new ServiceMethods(accessToken, refreshToken);
				const response = await serviceMethods.fetchSpaceById(spaceId);

				console.log("Space data:", response);


				if (isMounted) {
					if (response.flyUrl) {
						setFlyUrl(response.flyUrl);
						setLoading(false);
					} else {
						// If no flyUrl, schedule next fetch
						timeoutId = setTimeout(fetchSpaceData, 5000);
					}
				}
			} catch (err) {
				console.error("Error fetching space data:", err);
				if (isMounted) {
					setError(
						err instanceof Error
							? err.message
							: "An unexpected error occurred while fetching space data.",
					);
					// Even on error, we continue trying
					timeoutId = setTimeout(fetchSpaceData, 5000);
				}

			}
		};

		fetchSpaceData();


		return () => {
			isMounted = false;
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [user, spaceId, flyUrl]);


	return (
		<div className="relative w-full h-full">
            {flyUrl ? (
                <iframe
                    className="absolute inset-0 w-full h-full border-0"
                    title="vnc"
                    src={flyUrl}
                />
            ) : (
                <div className="flex justify-center items-center w-full h-full">
                    <LoadingSpinner />
                    <p className="ml-4 text-center">Waiting for VNC to be ready...</p>
                </div>
            )}
        </div>
	);
};

export default VncDisplay;
