import type React from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border border-black dark:border-white dark:text-white text-black rounded-lg font-bold transform hover:-translate-y-0.5 transition duration-400 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
