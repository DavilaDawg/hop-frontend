import { Button } from "@components/ui/Button";
import { Trash2 } from "lucide-react";
import { ServiceMethods } from "@lib/servicesMethods";
import { useUser } from "@stackframe/stack";
import { CiTrash } from "react-icons/ci";

interface RemoveSpaceButtonProps {
	spaceId: string;
	onRemove: (spaceId: string) => void;
}

const RemoveSpaceButton: React.FC<RemoveSpaceButtonProps> = ({
	spaceId,
	onRemove,
}) => {
	const user = useUser({ or: "redirect" });

	const handleRemove = async () => {
		try {
			const { accessToken, refreshToken } = await user.getAuthJson();
			if (!accessToken || !refreshToken) {
				throw new Error(
					"Access/refresh token are required for the ServiceMethods",
				);
			}

			const serviceMethods = new ServiceMethods(accessToken, refreshToken);
			await serviceMethods.fetchRemoveSpace(spaceId);

			onRemove(spaceId);
		} catch (err) {
			console.error("Error removing space:", err);
		}
	};

	return (
		<button
			type="button"
			className="p-2 rounded-full bg-transparent text-white"
			onClick={handleRemove}
			title="Remove Space"
		>
			<CiTrash className="text-red-600 size-6 " />
		</button>
	);
};

export default RemoveSpaceButton;
