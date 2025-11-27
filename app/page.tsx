import Link from "next/link";
import TypewriterTitle from "./components/TypewriterTitle";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="w-full py-6 px-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-serif font-bold tracking-tight">OpenNote.</div>
        <div className="space-x-6 text-sm font-medium text-stone-600">
          <Link href="#" className="hover:text-stone-900 transition-colors">Read</Link>
          <Link href="/communities" className="hover:text-stone-900 transition-colors">Communities</Link>
          <Link href="/about" className="hover:text-stone-900 transition-colors">About</Link>
          <Link href="/communities/create" className="px-4 py-2 bg-stone-900 text-stone-50 rounded-full hover:bg-stone-800 transition-colors">
            Write a Note
          </Link>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32 px-6 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-medium leading-tight mb-8 text-stone-900">
            Words that last <TypewriterTitle phrases={["forever", "for good times", "for history"]} />
          </h1>
          <p className="text-lg md:text-xl text-stone-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            A sanctuary for open notes, memories, and dedications.
            Share your gratitude, honor a memory, or stand for a cause.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-stone-900 text-white rounded-full text-lg hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl">
              Start Writing
            </button>
            <button className="px-8 py-3 bg-white text-stone-900 border border-stone-200 rounded-full text-lg hover:bg-stone-50 transition-all">
              Explore Notes
            </button>
          </div>
        </section>

        {/* Mission / About Section */}
        <section className="py-20 bg-stone-100 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif">Why OpenNote?</h2>
              <p className="text-stone-600 text-lg leading-relaxed">
                In a fleeting digital world, some words deserve to stay. OpenNote is a public archive of appreciation and remembrance. Whether it's a letter to a mentor, a memory of a lost loved one, or a pledge to a movement, your words find a permanent home here.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">🕊️</div>
                <h3 className="font-serif text-xl mb-2">Memorials</h3>
                <p className="text-sm text-stone-500">Honor those who have passed with dignity.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow mt-8">
                <div className="text-3xl mb-2">❤️</div>
                <h3 className="font-serif text-xl mb-2">Gratitude</h3>
                <p className="text-sm text-stone-500">Thank the people who changed your life.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">✊</div>
                <h3 className="font-serif text-xl mb-2">Causes</h3>
                <p className="text-sm text-stone-500">Stand up for what you believe in.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow mt-8">
                <div className="text-3xl mb-2">🌟</div>
                <h3 className="font-serif text-xl mb-2">Recognition</h3>
                <p className="text-sm text-stone-500">Celebrate everyday heroes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Tributes Preview */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Recent Notes</h2>
            <p className="text-stone-500">Read what others are sharing with the world.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "For Mrs. Gable",
                community: "St. Mary's School",
                communityType: "School",
                preview: "I never thought I could write until you showed me that my words mattered. Twenty years later, I'm still writing.",
                author: "Sarah Jenkins",
                time: "2 days ago"
              },
              {
                title: "To Grandpa Joe",
                community: "The Smith Family",
                communityType: "Family",
                preview: "Your laugh still echoes in our kitchen. We miss you more than words can say, but we celebrate you every day.",
                author: "Mike Smith",
                time: "5 hours ago"
              },
              {
                title: "Climate Action Now",
                community: "Green Earth Initiative",
                communityType: "Cause",
                preview: "We stand together for a future that is green, sustainable, and just. This is our pledge to the next generation.",
                author: "Elena Rodriguez",
                time: "1 day ago"
              }
            ].map((tribute, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="bg-white border border-stone-100 p-8 rounded-2xl shadow-sm group-hover:shadow-md transition-all h-full flex flex-col">
                  <div className="mb-6 flex justify-between items-start">
                    <span className="text-xs font-medium uppercase tracking-wider text-stone-400">Memory</span>
                    <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-800">
                      {tribute.community}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif mb-4 group-hover:text-stone-700 transition-colors">
                    "{tribute.title}"
                  </h3>
                  <p className="text-stone-500 text-sm line-clamp-3 mb-6 flex-grow">
                    {tribute.preview}
                  </p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-8 h-8 rounded-full bg-stone-200"></div>
                    <div className="text-sm">
                      <p className="font-medium text-stone-900">{tribute.author}</p>
                      <p className="text-stone-400 text-xs">{tribute.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="#" className="text-stone-900 font-medium border-b border-stone-900 pb-0.5 hover:text-stone-600 hover:border-stone-600 transition-colors">
              Read all notes &rarr;
            </Link>
          </div>
        </section>
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
