import { useState, useEffect, useRef } from "react";

interface PopupProfileContainerProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

const PopContainer: React.FC<PopupProfileContainerProps> = ({
	isOpen,
	onClose,
	children,
}) => {
	const [isAnimating, setIsAnimating] = useState(false);
	const popupRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen) {
			setIsAnimating(true);
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
			setIsAnimating(true);
			const timer = setTimeout(() => setIsAnimating(false), 300);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

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

	const handleAnimationEnd = () => {
		if (!isOpen) {
			setIsAnimating(false);
		}
	};

	if (!isOpen && !isAnimating) return null;

	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all  duration-300 ${
				isOpen ? "bg-black bg-opacity-50 backdrop-blur-sm" : "bg-transparent"
			}`}
		>
			<div
				ref={popupRef}
				className={`bg-gray-800 rounded-xl shadow-xl transition-all duration-300 transform ${
					isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
				}`}
				style={{ maxWidth: "90vw", maxHeight: "90vh" }}
				onAnimationEnd={handleAnimationEnd}
			>
				{children}
			</div>
		</div>
	);
};

export default PopContainer;
