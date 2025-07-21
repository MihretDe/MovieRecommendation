// components/MovieHero.tsx
"use client";

import Image from "next/image";

const moviePosters = [
  { src: "/mufasa.jpg", rotate: "-rotate-6", z: "z-10" },
  { src: "/sline.jpg", rotate: "rotate-0", z: "z-20" },
  { src: "/insideOut.jpeg", rotate: "rotate-6", z: "z-10" },

];

export default function MovieHero() {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-gray-800 text-white overflow-hidden">
      {/* Movie posters */}
      <div className="flex gap-4 items-end relative z-10">
        {moviePosters.map((poster, i) => (
          <div
            key={i}
            className={`transform ${poster.rotate} ${poster.z} shadow-lg rounded-xl overflow-hidden w-40 sm:w-48`}
          >
            <Image
              src={poster.src}
              alt={`Movie ${i + 1}`}
              width={192}
              height={288}
              className="w-full h-auto"
            />
          </div>
        ))}
      </div>

      {/* Text below */}
      <div className="mt-10 text-center z-10">
        <h1 className="text-2xl sm:text-4xl font-bold">
          Your<span className="text-purple-400"> Mood.</span>Your Movie.
          <br />
        </h1>
        Discover handpicked movies that match how you feel right now.
      </div>
    </div>
  );
}
