import Link from "next/link";

export default function About() {
    return (
        <div className="min-h-screen flex flex-col">

            <main className="grow py-20 px-6 max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-serif font-medium mb-12 text-stone-900">About OpenNote.</h1>

                <div className="space-y-8 text-lg text-stone-700 leading-relaxed font-serif">
                    <p>
                        OpenNote was born from a simple idea: <span className="italic">some words shouldn't be lost in the feed.</span>
                    </p>
                    <p>
                        In an era of fleeting digital interactions, we wanted to create a sanctuary for the words that matter most.
                        Whether it's a memory of a loved one who has passed, a note of gratitude to a mentor, or a public pledge to a cause you believe in,
                        OpenNote is the place where these sentiments can stand still.
                    </p>
                    <p>
                        We believe that writing is an act of preservation. By writing it down, you make it real, and you make it last.
                    </p>
                </div>

                <div className="mt-16 pt-16 border-t border-stone-200">
                    <h2 className="text-2xl font-serif mb-4">Contact Us</h2>
                    <p className="text-stone-600 mb-4">
                        Have a question or want to share your story? We'd love to hear from you.
                    </p>
                    <a href="mailto:ayomideoluwatola1@gmail.com" className="text-stone-900 font-medium border-b border-stone-900 pb-0.5 hover:text-stone-600 hover:border-stone-600 transition-colors">
                        hello@opennote.com
                    </a>
                </div>
            </main>

            <footer className="bg-stone-900 text-stone-400 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-2xl font-serif text-stone-50">OpenNote.</div>
                    <div className="flex gap-8 text-sm">
                        <Link href="#" className="hover:text-stone-200 transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-stone-200 transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-stone-200 transition-colors">Contact</Link>
                    </div>
                    <div className="text-xs text-stone-600">
                        &copy; {new Date().getFullYear()} OpenNote. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
