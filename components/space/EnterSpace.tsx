"use client";

import type React from "react";
import { useState, useEffect } from "react";
import randomColor from "randomcolor";
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

  useEffect(() => {
    if (!color) {
      const newColor = randomColor();
      setColor(newColor);
      setColorProp(newColor);
    }
  }, [color, setColorProp]);

  const handleClick = () => {
    onSubmit(true);
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