import React from "react";
import Button from "./Button";

type PageItem = number | "...";

interface PaginationProps {
    currentPage: number;      // 1-based
    totalPages: number;       // >= 1
    onPageChange: (page: number) => void;
    maxNumeric?: number;      // how many numbered buttons (default 10)
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    maxNumeric = 10,
}: PaginationProps) {
    const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

    const getPageItems = (): PageItem[] => {
        if (totalPages <= maxNumeric) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const first = 1;
        const last = totalPages;
        const innerSlots = maxNumeric - 2; // reserve for first + last
        const half = Math.floor(innerSlots / 2);

        // Propose a centered window around current within [2, last-1]
        let start = clamp(currentPage - half, 2, Math.max(2, last - innerSlots));
        let end = Math.min(last - 1, start + innerSlots - 1);

        // If we're too close to the right, pull window left
        if (end - start + 1 < innerSlots) {
            start = Math.max(2, end - innerSlots + 1);
        }

        const items: PageItem[] = [first];

        if (start > 2) items.push("...");
        for (let p = start; p <= end; p++) items.push(p);
        if (end < last - 1) items.push("...");

        items.push(last);
        return items;
    };

    const items = getPageItems();

    const go = (p: number) => {
        const page = clamp(p, 1, totalPages);
        if (page !== currentPage) onPageChange(page);
    };

    const btnBase =
        "px-3 py-1 rounded text-sm md:text-base transition select-none";
    const btnGhost = "text-gray-500 dark:text-gray-300";

    return (
        <nav className="flex items-center justify-center gap-2 mt-6" aria-label="Pagination">
            <Button
                onClick={() => go(currentPage - 1)}
                variant="outlined"
                disabled={currentPage === 1}
            >
             		Prev
            </Button>
            
            {items.map((it, idx) => it === "..." 
                ? <span key={`dots-${idx}`} className={`${btnBase} ${btnGhost} cursor-default`}>
                        …
                    </span>
                : <Button
                    key={it}
                    onClick={() => go(it)}
                    variant={it === currentPage ? "contained" : "outlined"}
                >
                    {it}
                </Button>
            )}

            <Button
                onClick={() => go(currentPage + 1)}
                variant="outlined"
                disabled={currentPage === totalPages}
            >
             		Next
            </Button>
        </nav>
    );
}
