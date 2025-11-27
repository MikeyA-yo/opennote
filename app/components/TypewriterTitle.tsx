"use client";

import { useState, useEffect } from "react";

interface TypewriterTitleProps {
    phrases: string[];
}

export default function TypewriterTitle({ phrases }: TypewriterTitleProps) {
    const [text, setText] = useState("");
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);

    useEffect(() => {
        const currentPhrase = phrases[phraseIndex];

        const handleTyping = () => {
            if (isDeleting) {
                setText(currentPhrase.substring(0, text.length - 1));
                setTypingSpeed(100); // Faster when deleting
            } else {
                setText(currentPhrase.substring(0, text.length + 1));
                setTypingSpeed(250); // Normal typing speed
            }

            if (!isDeleting && text === currentPhrase) {
                // Finished typing phrase
                setTimeout(() => setIsDeleting(true), 2000); // Wait before deleting
            } else if (isDeleting && text === "") {
                // Finished deleting
                setIsDeleting(false);
                setPhraseIndex((prev) => (prev + 1) % phrases.length);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);

        return () => clearTimeout(timer);
    }, [text, isDeleting, phraseIndex, phrases, typingSpeed]);

    return (
        <span className="italic text-stone-500 inline-block min-w-[200px] text-left">
            {text}
            <span className="animate-pulse ml-1 not-italic">|</span>
        </span>
    );
}
