// components/ui/Button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

export const Button = ({ children, variant = "primary", className = "", ...props }: ButtonProps) => {
  const baseStyles = "group relative overflow-hidden border-2 px-10 py-5 text-[12px] font-black tracking-[0.4em] uppercase transition-colors duration-300";
  
  const variants = {
    primary: "border-white bg-black text-white",
    secondary: "border-black bg-white text-black", 
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {/* The "Grow" Background Layer */}
      <span className={`absolute cursor-pointer  inset-0 z-0 translate-y-full transition-transform duration-500 ease-out origin-center group-hover:translate-y-0 ${variant === 'primary' ? 'bg-white' : 'bg-black'}`} />

      {/* The Text Layer */}
      <span className={`relative z-10 transition-colors duration-500 ${variant === 'primary' ? 'group-hover:text-black' : 'group-hover:text-white'}`}>
        {children}
      </span>
    </button>
  );
};