"use client";

import * as React from "react";
import { usePerfectCursor } from "../hooks/useCursor";

interface CursorProps {
	point: [number, number];
	imageUrl: string; 
	username: string;
}

export function CustomCursor({ point, imageUrl, username }: CursorProps) {
	const rCursor = React.useRef<HTMLImageElement | null>(null);

	const animateCursor = React.useCallback((point: number[]) => {
		const elm = rCursor.current;
		if (!elm) return;
		elm.style.setProperty(
			"transform",
			`translate(${point[0]}px, ${point[1]}px)`,
		);
	}, []);

	const onPointMove = usePerfectCursor(animateCursor, point);

	React.useLayoutEffect(() => {
		onPointMove(point);
	}, [onPointMove, point]);

	return (
		<div
			ref={rCursor}
			style={{
				position: "absolute",
				transform: `translate(${point[0]}px, ${point[1]}px)`,
				pointerEvents: "none",
			}}
			className="flex flex-col items-center"
		>
			<img
				src={imageUrl}
				alt="Custom Cursor"
				className="rounded-xl w-10 h-10"
			/>
			<p className="bg-white text-black mt-2 px-1 rounded-[10px] font-semibold">{username}</p>
		</div>
	);
}
