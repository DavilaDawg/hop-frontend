import type { ReactNode } from "react";

interface ScrollBarProps {
	children: ReactNode;
	maxHeight?: string;
}

const ScrollBar: React.FC<ScrollBarProps> = ({
	children,
	maxHeight = "100%",
}) => {
	return (
		<div
			className="overflow-y-auto pr-2"
			style={{
				maxHeight,
				scrollbarWidth: "thin",
				scrollbarColor: "#4B5563 #1F2937",
			}}
		>
			{children}
		</div>
	);
};

export default ScrollBar;
