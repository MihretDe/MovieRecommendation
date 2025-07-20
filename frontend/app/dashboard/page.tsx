"use client";

import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaClock,
  FaGhost,
  FaGrinStars,
  FaSadTear,
  FaSmile,
  FaSpa,
} from "react-icons/fa";

const moodIcons: Record<string, JSX.Element> = {
  happy: <FaSmile className="text-yellow-400" />,
  sad: <FaSadTear className="text-blue-400" />,
  excited: <FaGrinStars className="text-pink-400" />,
  scared: <FaGhost className="text-purple-400" />,
  relaxed: <FaSpa className="text-green-400" />,
  nostalgic: <FaClock className="text-orange-300" />,
};

const Dashboard = () => {
  const router = useRouter();
  const [moods, setMoods] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const handleMoodClick = (mood: string) => {
    router.push(`/movies?mood=${mood.toLowerCase()}`);
  };

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/moods`);
        const data = await res.json();
        if (data?.moods) {
          setMoods(data.moods);
        }
      } catch (err) {
        console.error("Failed to fetch moods:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoods();
  }, []);

  return (
    <div className="min-h-screen text-white font-sans">
      {/* Hero Section (2/3 screen) */}
      <section
        className="h-[55vh] relative bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url("/Rectangle.svg")` }}
      >
        <div className="absolute inset-0 bg-black/55"></div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Your Mood. Your Movie.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-6">
            Let your emotions guide your next watch.
          </p>
        </div>
      </section>

      {/* Mood Selection Section */}
      <section className="h-[34vh] bg-[#0e0e0e] px-6 md:px-20 py-6 md:py-8">
        <h2 className="text-center text-2xl md:text-3xl font-semibold mb-6">
          Choose a Mood
        </h2>

        {loading ? (
          <p className="text-center text-gray-400">Loading moods...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 justify-center items-center max-w-4xl mx-auto">
            {moods.map((mood) => (
              <button
                key={mood}
                onClick={() => handleMoodClick(mood)}
                className="flex flex-col items-center justify-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-xl px-4 py-6 transition-transform transform hover:scale-105 border border-white/10 shadow-lg"
              >
                <div className="text-3xl">
                  {moodIcons[mood.toLowerCase()] || <FaSmile />}
                </div>
                <span className="text-base md:text-lg font-medium capitalize">
                  {mood}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
