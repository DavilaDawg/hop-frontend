import type React from "react";
import Image from "next/image";
import { useState } from "react";
interface SelectProps {
	setSelectedCursor: (cursor: string) => void;
}

const SelectCursor: React.FC<SelectProps> = ({ setSelectedCursor }) => {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	const handleClick = (src: string) => {
		setSelectedCursor(src);

		setSelectedImage(src);
	};

	return (
		<div className="absolute bg-slate-500 flex flex-row pt-2 pb-2 pr-3">
			<Image
				onClick={() => handleClick("/norm.png")}
				className={`ml-3 w-[25%] h-[100%] transition-transform transform hover:scale-105 border-2 border-slate-500${selectedImage === "/norm.png" ? "border-3 border-green-500" : ""}`}
				src={"/norm.png"}
				alt={"cursor"}
				width={50}
				height={50}
			/>
			<Image
				onClick={() => handleClick("/monkey.jpg")}
				className={`ml-3 w-[100%] transition-transform transform hover:scale-105 border-2 border-slate-500${selectedImage === "/monkey.jpg" ? "border-spacing-3 border-green-500" : ""}`}
				src={"/monkey.jpg"}
				alt={"cursor"}
				width={50}
				height={50}
			/>
			<Image
				onClick={() => handleClick("/ani.jpg")}
				className={`ml-3 w-[25%] h-[100%] transition-transform transform hover:scale-105 border-2 border-slate-500${selectedImage === "/ani.jpg" ? "border-3 border-green-500" : ""}`}
				src={"/ani.jpg"}
				alt={"cursor"}
				width={50}
				height={50}
			/>
			<Image
				onClick={() => handleClick("/emoji.jpg")}
				className={`ml-3 w-[100%] transition-transform transform hover:scale-105 border-2 border-slate-500${selectedImage === "/emoji.jpg" ? "border-3 border-green-500" : ""}`}
				src={"/emoji.jpg"}
				alt={"cursor"}
				width={50}
				height={50}
			/>
			<Image
				onClick={() => handleClick("/partick.jpg")}
				className={`ml-3 w-[25%] h-[80%] transition-transform transform hover:scale-105 border-2 border-slate-500${selectedImage === "/partick.jpg" ? "border-3 border-green-500" : ""}`}
				src={"/patrick.jpg"}
				alt={"cursor"}
				width={50}
				height={50}
			/>
			<Image
				onClick={() => handleClick("/skate.jpg")}
				className={`ml-3 w-[25%] h-[80%] transition-transform transform hover:scale-105 border-2 border-slate-500${selectedImage === "/skate.jpg" ? "border-3 border-green-500" : ""}`}
				src={"/skate.jpg"}
				alt={"cursor"}
				width={50}
				height={50}
			/>
		</div>
	);
};

export default SelectCursor;
