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
import MovieHero from "../components/MovieHero";
import MovieCard from "../components/MovieCard"; // you should have a MovieCard component
import { Movie } from "../movies/page";

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
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [loadingMoods, setLoadingMoods] = useState(true);
  const [loadingMovies, setLoadingMovies] = useState(true);

   const getAuthToken = (): string | null => {
     if (typeof window !== "undefined") {
       return localStorage.getItem("access_token");
     }
     return null;
   };
 

  const handleMoodClick = (mood: string) => {
    router.push(`/movies?mood=${mood.toLowerCase()}`);
  };

  useEffect(() => {
    
    const fetchMoods = async () => {
      const token = getAuthToken();
      if (!token) {
        router.push("/signin");
        return null;
      }
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/moods`);
        const data = await res.json();
        if (data?.moods) {
          setMoods(data.moods);
        }
      } catch (err) {
        console.error("Failed to fetch moods:", err);
      } finally {
        setLoadingMoods(false);
      }
    };

    const fetchTrendingMovies = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/movies?page=1`
        );
        const data = await res.json();
        if (data?.results) {
          setTrendingMovies(data.results);
        }
      } catch (err) {
        console.error("Failed to fetch trending movies:", err);
      } finally {
        setLoadingMovies(false);
      }
    };

    fetchMoods();
    fetchTrendingMovies();
  }, [router]);

  return (
    <div className="min-h-screen text-white font-sans">
      {/* Hero Section */}
      <MovieHero />

      {/* Mood Selection Section */}
      <section className="px-6 md:px-20 py-6 md:py-8 bg-gray-800">
        <h2 className="text-center text-2xl md:text-3xl font-semibold mb-6">
          Choose a Mood
        </h2>

        {loadingMoods ? (

      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Moods ...</p>
        </div>
      </div>
    
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 justify-center items-center max-w-4xl mx-auto">
            {moods.map((mood) => (
              <button
                key={mood}
                onClick={() => handleMoodClick(mood)}
                className="flex flex-col items-center cursor-pointer justify-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-xl px-4 py-6 transition-transform transform hover:scale-105 border border-white/10 shadow-lg"
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

      {/* Trending Movies Section */}
      <section className="px-6 md:px-20 py-10 bg-gray-800">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
          Trending Movies
        </h2>

        {loadingMovies ? (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Trending Movies...</p>
        </div>
      </div>
    
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {trendingMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
