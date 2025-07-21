import { useRouter } from "next/navigation";
import React from "react";
import FavoriteButton from "../components/favorite-button"; // Adjust the import path as necessary
import Image from "next/image";

interface Movie {
  _id: string;
  title: string;
  posterPath: string;
  voteAverage: number;
  releaseDate: string;
}

const MovieCard = ({ movie }: { movie: Movie }) => {
    const router = useRouter();
  return (
     <div
      className="cursor-pointer w-[150px] md:w-[220px] hover:scale-105 transition transform"
      onClick={() => router.push(`/movies/${movie._id}`)}
    >
       <div className="w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] overflow-hidden rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105 group">
      <div className="relative">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
          width={200}
          height={300}
          alt={movie.title}
          className="h-[260px] sm:h-[280px] md:h-[300px] lg:h-[330px] w-full object-cover rounded-lg"
        />
         {/* Favorite Button */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <FavoriteButton movieId={movie._id} movieTitle={movie.title} moviePosterPath={movie.posterPath} size="sm" />
          </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-base font-semibold text-white truncate">
            {movie.title}
          </h3>
          <p className="text-xs text-gray-300">
            ⭐ {movie.voteAverage.toFixed(1)} · {movie.releaseDate.slice(0, 4)}
          </p>
        </div>
      </div>
    </div> 
    </div>
    
  );
};

export default MovieCard;
