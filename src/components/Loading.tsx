"use client";

import React from "react";

type Props = {
    label?: string;
    className?: string;
};

export default function Loading({
    label,
    className = "",
}: Props) {

    return (
        <div
            className={`flex items-center justify-center gap-3 text-gray-300 ${className}`}
            aria-live="polite"
            aria-busy="true"
        >
            <div className="flex items-end gap-1">
                <span className="w-1.5 rounded-sm bg-gray-600 h-3 animate-[bounce_1s_infinite]"></span>
                <span className="w-1.5 rounded-sm bg-gray-500 h-5 animate-[bounce_1s_infinite] [animation-delay:0.1s]"></span>
                <span className="w-1.5 rounded-sm bg-gray-400 h-8 animate-[bounce_1s_infinite] [animation-delay:0.2s]"></span>
                <span className="w-1.5 rounded-sm bg-gray-500 h-5 animate-[bounce_1s_infinite] [animation-delay:0.3s]"></span>
                <span className="w-1.5 rounded-sm bg-gray-600 h-3 animate-[bounce_1s_infinite] [animation-delay:0.4s]"></span>
            </div>

            {label && <span className="text-sm">{label}</span>}
        </div>
    );
}
