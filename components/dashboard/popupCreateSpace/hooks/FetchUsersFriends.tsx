import { useState, useEffect } from "react";
import { useUser } from "@stackframe/stack";
import { ServiceMethods } from "@lib/servicesMethods";

interface Friend {
	id: string;
	nickname: string;
	username: string;
	profilePicture?: string;
	isOnline?: boolean;
	currentRoom?: string;
}

const useFetchFriends = () => {
	const user = useUser({ or: "redirect" });
	const [friends, setFriends] = useState<Friend[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchFriends = async () => {
			setLoading(true);
			setError(null);
			try {
				const { accessToken, refreshToken } = await user.getAuthJson();
				if (!accessToken || !refreshToken) {
					throw new Error(
						"Access/refresh token are required for the ServiceMethods",
					);
				}

				const serviceMethods = new ServiceMethods(accessToken, refreshToken);
				const response = await serviceMethods.fetchAllFriends();
				setFriends(response);
			} catch (err) {
				console.error("Error fetching friends:", err);
				setError(
					err instanceof Error
						? err.message
						: "An unexpected error occurred while fetching friends.",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchFriends();
	}, [user]);

	return { friends, loading, error };
};

export default useFetchFriends;
