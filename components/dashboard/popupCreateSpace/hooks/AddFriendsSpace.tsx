import { useState } from "react";
import { useUser } from "@stackframe/stack";
import { ServiceMethods } from "@lib/servicesMethods";

interface AddUserToSpaceParams {
	spaceId: string;
	userId: string;
	role: string;
}

interface AddUserToSpaceResult {
	addUser: (params: AddUserToSpaceParams) => Promise<void>;
	loading: boolean;
	error: string | null;
	success: boolean;
}

const useAddUserToSpace = (): AddUserToSpaceResult => {
	const user = useUser({ or: "redirect" });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const addUser = async (params: AddUserToSpaceParams) => {
		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const { accessToken, refreshToken } = await user.getAuthJson();
			if (!accessToken || !refreshToken) {
				throw new Error(
					"Access/refresh token are required for the ServiceMethods",
				);
			}

			const serviceMethods = new ServiceMethods(accessToken, refreshToken);
			await serviceMethods.fetchAddFriendToSpace(params.spaceId, params.userId);

			setSuccess(true);
			console.log("User added to space successfully");
		} catch (error) {
			console.error("Error adding user to space:", error);
			setError(
				error instanceof Error
					? error.message
					: "An unexpected error occurred while adding user to space",
			);
		} finally {
			setLoading(false);
		}
	};

	return { addUser, loading, error, success };
};

export default useAddUserToSpace;
