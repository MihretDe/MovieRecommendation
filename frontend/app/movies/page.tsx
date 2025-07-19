"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MovieCard from "../components/MovieCard";

interface Movie {
_id: string;
title: string;
posterPath: string;
voteAverage: number;
releaseDate: string;
overview: string;
}

interface MoviesResponse {
results: Movie[];
page: number;
totalPages: number;
}

const MoviesPage = () => {
const searchParams = useSearchParams();
const mood = searchParams.get("mood") || "";

const [movies, setMovies] = useState<Movie[]>([]);
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [loading, setLoading] = useState(true);

useEffect(() => {
const fetchMovies = async () => {
setLoading(true);
try {
const res = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/movies?mood=${mood}&page=${currentPage}`
);

const data: MoviesResponse = await res.json();
console.log("Fetched movies:", data);
setMovies(data.results || []);
setCurrentPage(data.page || 1);
setTotalPages(data.totalPages || 1);
} catch (error) {
console.error("Error fetching movies:", error);
} finally {
setLoading(false);
}
};


if (mood) fetchMovies();
}, [mood, currentPage]);

const handlePrevious = () => {
if (currentPage > 1) setCurrentPage((prev) => prev - 1);
};

const handleNext = () => {
if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
};

return (
<div className="min-h-screen bg-gray-800 text-white px-6 py-10">
<h1 className="text-3xl md:text-4xl font-bold mb-6 capitalize text-center">
Movies for "{mood}"
</h1>


  {loading ? (
    <p className="text-center text-gray-400">Loading movies...</p>
  ) : movies.length === 0 ? (
    <p className="text-center text-red-400">
      No movies found for this mood.
    </p>
  ) : (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center px-4 md:px-10 py-10">
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
};

export default MoviesPage;