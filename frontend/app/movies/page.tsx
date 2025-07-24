"use client";

import { fetchMoviesByMood } from "@/lib/feauters/movie/movieSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";

function MoviesPageContent() {
  const searchParams = useSearchParams();
  const mood = searchParams.get("mood") || "";
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { movies, totalPages, loading } = useAppSelector(
    (state) => state.movies
  );
  const [currentPage, setCurrentPage] = useState(1);

  const getAuthToken = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/signin");
      return;
    }

    if (mood) {
      dispatch(fetchMoviesByMood({ mood, page: currentPage }));
    }
  }, [mood, currentPage, dispatch, router]);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white px-6 py-20">
      {loading ? (
        <div className="min-h-screen bg-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading Movies...</p>
          </div>
        </div>
      ) : movies.length === 0 ? (
        <p className="text-center text-red-400">
          No movies found for this mood.
        </p>
      ) : (
        <>
          <h1 className="text-3xl md:text-4xl font-bold mb-6 capitalize text-center">
            Movies for &quot;{mood}&quot;
          </h1>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 justify-center md:px-10 py-10">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-lg">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function MoviesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MoviesPageContent />
    </Suspense>
  );
}
