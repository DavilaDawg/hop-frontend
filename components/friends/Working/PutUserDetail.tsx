import { useState } from "react";
import { ServiceMethods } from "@lib/servicesMethods";
import { useUser } from "@stackframe/stack";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";

const UpdateUserProfileComponent = () => {
	const user = useUser({ or: "redirect" });
	const [username, setUsername] = useState("");
	const [nickname, setNickname] = useState("");
	const [profilePicture, setProfilePicture] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const updateProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const { accessToken, refreshToken } = await user.getAuthJson();
			const serviceMethods = new ServiceMethods(
				accessToken || "",
				refreshToken || "",
			);
			await serviceMethods.fetchUpdateUser(username, nickname, profilePicture);
			setSuccess(true);
		} catch (err) {
			console.error("Error updating user profile:", err);
			if (err instanceof Error) {
				setError(`Failed to update profile: ${err.message}`);
			} else {
				setError("An unexpected error occurred while updating profile.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={updateProfile} className="space-y-4">
			<Input
				type="text"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				placeholder="Username"
				required
			/>
			<Input
				type="text"
				value={nickname}
				onChange={(e) => setNickname(e.target.value)}
				placeholder="Nickname"
				required
			/>
			<Input
				type="text"
				value={profilePicture}
				onChange={(e) => setProfilePicture(e.target.value)}
				placeholder="Profile Picture URL"
				required
			/>
			<Button
				type="submit"
				className="bg-blue-500 text-white px-4 py-2 rounded-lg"
				disabled={loading}
			>
				{loading ? "Updating..." : "Update Profile"}
			</Button>
			{error && <p className="text-red-500 mt-2">{error}</p>}
			{success && (
				<p className="text-green-500 mt-2">Profile updated successfully!</p>
			)}
		</form>
	);
};

export default UpdateUserProfileComponent;
