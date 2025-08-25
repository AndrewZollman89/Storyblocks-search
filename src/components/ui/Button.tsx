import React from "react";

interface ButtonProps {
    type?: 'button' | 'submit' | 'reset';
    variant?: 'contained' | 'outlined' | 'text';
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}

export default function Button(props: ButtonProps) {
    const { type = 'button', className, variant = 'contained', onClick, disabled = false } = props;

    return <button 
        type={type}
        onClick={onClick} 
        disabled={disabled}
        className={`${className} rounded-lg px-3 py-2 text-sm ${variant === "contained" ? "bg-gray-700 hover:bg-gray-600" : "border border-gray-700 hover:bg-gray-700"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
        {props.children}
    </button>
}