import React from "react";
import FavoriteButton from "../../components/favorite-button";

const getMovieById = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Movie not found");
  return res.json();
};

const MovieDetailPage = async ({ params }: { params: { id: string } }) => {
  const movie = await getMovieById(params.id);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        <div className="relative">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
            alt={movie.title}
            className="rounded-lg shadow-lg w-full"
          />
          {/* Favorite button on poster */}
          <div className="absolute top-4 right-4">
            <FavoriteButton               movieId={movie._id}
              movieTitle={movie.title}
              moviePosterPath={movie.posterPath} size="lg" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <p className="text-gray-400 mb-4">{movie.releaseDate}</p>
          <p className="mb-4 text-lg">{movie.overview}</p>
          <p className="text-yellow-400 text-lg mb-2">
            ⭐ {movie.voteAverage} / 10
          </p>

          <div className="text-sm text-gray-400">
            <p>
              <strong>Runtime:</strong> {movie.runtime} min
            </p>
            <p>
              <strong>Votes:</strong> {movie.voteCount}
            </p>
            <p>
              <strong>Genres:</strong>{" "}
              {movie.genres.map((g: any) => g.name).join(", ")}
            </p>
            <p>
              <strong>Moods:</strong>{" "}
              {movie.moods.map((m: any) => m.name).join(", ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
