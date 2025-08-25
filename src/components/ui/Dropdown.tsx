import React from "react";
import Button from "./Button";

export function DropdownItem ({
    onClick,
    mediaType,
    index,
    item
}: {
    onClick: (item: string) => void;
    className?: string;
    index?: number;
    item: string;
    mediaType?: string;
}) {
    return (
        <button
            key={item}
            onClick={() => onClick(item)}
            className={`block w-full ${index === 0 ? "px-4 font-medium text-blue-300" : "px-10 text-gray-200"} py-2 text-left text-sm ${mediaType === item ? "bg-gray-700" : ""} hover:bg-gray-700`}
        >
            {item}
        </button>
    );
}

export default function Dropdown({
    ref,
    value,
    opended,
    onOpen,
    disabled,
    children
}: {
    ref?: React.RefObject<HTMLDivElement | null>;
    className?: string;
    value?: string;
    opended?: boolean;
    onOpen?: () => void;
    disabled?: boolean;
    children?: React.ReactNode;
}) {
    return (
        <div className="relative" ref={ref}>
            <Button
                onClick={onOpen}
                disabled={disabled}
                className="flex items-center gap-2 text-sm text-gray-100"
            >
                {value}
                <span className="ml-1">▾</span>
            </Button>
            {opended && (
                <div className="absolute left-0 mt-1 w-64 rounded-lg border border-gray-700 bg-gray-800 shadow-lg">
                    {children}
                </div>
            )}
        </div>
    );
}