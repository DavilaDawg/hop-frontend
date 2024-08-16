import { useRef, useEffect } from "react";

interface PopupProps {
	isOpen: boolean;
	onClose: () => void;
	children?: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, children }) => {
	const popupRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				popupRef.current &&
				!popupRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div
				ref={popupRef}
				className="bg-white rounded-xl"
				style={{
					width: "23%",
					height: "45%",
					maxWidth: "90vw",
					maxHeight: "90vh",
				}}
			>
				{children}
			</div>
		</div>
	);
};

export default Popup;
