"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="w-full py-6 px-6 md:px-12 bg-stone-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-serif font-bold tracking-tight z-50 relative">
                    OpenNote.
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-stone-600">
                    <Link href="/communities" className="text-stone-900 transition-colors">Communities</Link>
                    <Link href="/about" className="hover:text-stone-900 transition-colors">About</Link>
                    <Link href="/communities/create" className="px-5 py-2.5 bg-stone-900 text-stone-50 rounded-full hover:bg-stone-800 transition-colors">
                        Write a Note
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden z-50 relative p-2"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    <div className="w-6 h-5 flex flex-col justify-between">
                        <span className={`w-full h-0.5 bg-stone-900 transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
                        <span className={`w-full h-0.5 bg-stone-900 transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
                        <span className={`w-full h-0.5 bg-stone-900 transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
                    </div>
                </button>

                {/* Mobile Menu Overlay */}
                <div className={`fixed inset-0 bg-stone-50 z-40 flex flex-col items-center justify-center space-y-8 transition-all duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
                    <Link href="#" onClick={() => setIsOpen(false)} className="text-2xl font-serif text-stone-900 hover:text-stone-600">Read</Link>
                    <Link href="/communities" onClick={() => setIsOpen(false)} className="text-2xl font-serif text-stone-900 hover:text-stone-600">Communities</Link>
                    <Link href="/about" onClick={() => setIsOpen(false)} className="text-2xl font-serif text-stone-900 hover:text-stone-600">About</Link>
                    <Link href="/communities/create" onClick={() => setIsOpen(false)} className="px-8 py-3 bg-stone-900 text-stone-50 rounded-full text-lg hover:bg-stone-800 transition-colors">
                        Write a Note
                    </Link>
                </div>
            </div>
        </nav>
    );
}
