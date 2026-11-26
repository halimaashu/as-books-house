import React from "react";
import Marquee from "react-fast-marquee";
import { FaBookOpen } from "react-icons/fa";

const languageTopics = [
  "Japanese", "German", "English learning", "Bangla", "Korean", "Arabic", "Chinese",
  "Grammar & vocabulary", "Exam preparation", "Dictionaries",
];

export default function Marque() {
  return (
    <section className="px-4 py-6 sm:px-6">
      <div className="container mx-auto flex items-stretch overflow-hidden rounded-2xl bg-slate-900 shadow-xl shadow-slate-900/20">
        {/* Label */}
        <div className="flex shrink-0 items-center gap-2 bg-[#cf6410] px-4 py-4 text-white sm:gap-3 sm:px-8">
          <h2 className="text-sm font-extrabold uppercase tracking-wide sm:text-lg">
            <span className="hidden sm:inline">Explore </span>Languages
          </h2>
        </div>

        {/* Scrolling text */}
        <Marquee pauseOnHover speed={50} gradient={false} className="py-4">
          {languageTopics.map((topic) => (
            <div key={topic} className="flex items-center">
              <span className="flex items-center gap-2 px-6 text-sm font-extrabold text-white sm:text-lg">
                <FaBookOpen className="text-green-400" />
                <span className="rounded-full bg-green-500 px-3 py-0.5 text-xs font-extrabold text-white sm:text-sm">
                  {topic}
                </span>
                <span className="text-orange-200">Books for every stage of learning</span>
              </span>
              <span className="h-2 w-2 rounded-full bg-red-500" />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
