"use client";

// biome-ignore lint/style/useImportType: <explanation>
import React, { useState, useEffect } from "react";
import randomColor from "randomcolor";
import useWebSocket from "react-use-websocket";
import Image from "next/image";
interface NicknameProps {
    onSubmit: (enterSpace: boolean) => void;
    setColorProp: (color: string) => void;
    username: string;
    pfp: string;
    nickname: string; 
}

const EnterSpace: React.FC<NicknameProps> = ({
    onSubmit,
    setColorProp,
    username,
    pfp,
    nickname,
}) => {
    const [color, setColor] = useState("");
    const [wsUrl, setWsUrl] = useState<string | null>(null);

    const { sendJsonMessage } = useWebSocket(wsUrl, {
        shouldReconnect: () => true,
        reconnectAttempts: 100,
        share: true,
    });

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (!color) {
            const newColor = randomColor();
            setColor(newColor);
            setColorProp(color);
        }
    }, [color]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        setWsUrl(
            `wss://hop-websocket1-76a542d0c47b.herokuapp.com?username=${encodeURIComponent(username)}&pfp=${encodeURIComponent(pfp)}&nickname=${encodeURIComponent(nickname)}`,
        );
    }, []);

    const handleClick = () => {
        onSubmit(true);
        sendJsonMessage({
            type: "setUsername",
            username: username,
            pfp: pfp,
            nickname: nickname,
        });
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="relative text-white rounded-xl shadow-lg p-6 w-96 h-56 flex items-center justify-center">
                <Image
                    src="/images/Logo.webp"
                    alt="Logo"
                    width={700}
                    height={700}
                    priority
                    className="absolute inset-0 object-cover"
                    style={{ top: "-30%" }}
                />
                <button
                    type="button"
                    onClick={handleClick}
                    className="z-10 bg-pink-400 hover:bg-pink-500 text-white p-4 rounded-xl text-2xl font-bold mt-72"
                >
                    Hop In
                </button>
            </div>
        </div>
    );
};

export default EnterSpace;