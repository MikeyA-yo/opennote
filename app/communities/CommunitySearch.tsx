"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

export default function CommunitySearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get("search") || "";
    const [text, setText] = useState(initialSearch);
    const [query] = useDebounce(text, 500);

    useEffect(() => {
        if (!query && !initialSearch) return;

        const params = new URLSearchParams(searchParams);
        if (query) {
            params.set("search", query);
        } else {
            params.delete("search");
        }
        router.replace(`/communities?${params.toString()}`);
    }, [query, router, searchParams, initialSearch]);

    return (
        <div className="relative max-w-md w-full">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Search communities..."
                className="w-full px-4 py-3 pl-10 bg-white border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-stone-900"
            />
            <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
        </div>
    );
}
