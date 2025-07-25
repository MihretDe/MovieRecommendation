"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  Trash2,
  Search,
  Grid,
  List,
  Star,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FavoriteButton from "../components/favorite-button";
import type { FavoriteResponse, ApiResponse } from "../../types/api";
import Image from "next/image";

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFavourites,
  removeFavourite,
} from "@/lib/feauters/favourites/favouritesSlice";
import { RootState, AppDispatch } from "@/lib/store"; // adjust path if needed

interface FavoriteMovie extends FavoriteResponse {
  voteAverage?: number;
  releaseDate?: string;
  runtime?: number;
  genres?: string[];
}

export default function FavoritesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const router = useRouter();

  const dispatch: AppDispatch = useDispatch(); // <-- type your dispatch
  const { favourites, loading } = useSelector(
    (state: RootState) => state.favourites
  );

  // Fetch favorites from Redux store
  useEffect(() => {
    dispatch(fetchFavourites());
  }, [dispatch]);

  // Filter and sort favorites
  const filteredFavorites = (() => {
    const filtered = favourites
      .map((fav) => ({
        ...fav,
        voteAverage: (fav as FavoriteMovie).voteAverage ?? undefined,
        releaseDate: (fav as FavoriteMovie).releaseDate ?? undefined,
        runtime: (fav as FavoriteMovie).runtime ?? undefined,
        genres: (fav as FavoriteMovie).genres ?? undefined,
      }))
      .filter((movie) =>
        movie.movieTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );

    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "title":
        filtered.sort((a, b) => a.movieTitle.localeCompare(b.movieTitle));
        break;
      case "rating":
        filtered.sort((a, b) => (b.voteAverage || 0) - (a.voteAverage || 0));
        break;
    }
    return filtered;
  })();

  // Remove from favorites using Redux
  const handleRemoveFavorite = (movieId: string) => {
    dispatch(removeFavourite(movieId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white my-12">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Favorites</h1>
              <p className="text-gray-400">
                {favourites.length}{" "}
                {favourites.length === 1 ? "movie" : "movies"} in your
                collection
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search your favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-800 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`${
                    viewMode === "grid"
                      ? "bg-red-600 hover:bg-red-700"
                      : "text-gray-400 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`${
                    viewMode === "list"
                      ? "bg-red-600 hover:bg-red-700"
                      : "text-gray-400 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredFavorites.length === 0 ? (
          <div className="text-center py-16">
            {searchQuery ? (
              <div>
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No movies found
                </h3>
                <p className="text-gray-500">Try adjusting your search terms</p>
              </div>
            ) : (
              <div>
                <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No favorites yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Start adding movies to your favorites to see them here
                </p>
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Discover Movies
                </Button>
              </div>
            )}
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {filteredFavorites.map((movie: FavoriteMovie) => (
                  <MovieCardGrid
                    key={movie.movieId}
                    movie={movie}
                    onRemove={handleRemoveFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFavorites.map((movie: FavoriteMovie) => (
                  <MovieCardList
                    key={movie.movieId}
                    movie={movie}
                    onRemove={handleRemoveFavorite}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Grid View Movie Card
function MovieCardGrid({
  movie,
  onRemove,
}: {
  movie: FavoriteMovie;
  onRemove: (id: string) => void;
}) {
  const router = useRouter();

  return (
    <div className="group relative">
      <div
        className="cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        onClick={() => router.push(`/movies/${movie.movieId}`)}
      >
        <div className="relative aspect-[2/3]">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.moviePosterPath}`}
            alt={movie.movieTitle}
            width={300}
            height={450}
            className="w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="text-sm font-semibold text-white truncate">
                {movie.movieTitle}
              </h3>
              {movie.voteAverage && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-300">
                    {movie.voteAverage.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Remove Button */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(movie.movieId);
              }}
              className="w-8 h-8 p-0 bg-red-600/80 hover:bg-red-700 backdrop-blur-sm"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// List View Movie Card
function MovieCardList({
  movie,
  onRemove,
}: {
  movie: FavoriteMovie;
  onRemove: (id: string) => void;
}) {
  const router = useRouter();

  return (
    <div
      className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors cursor-pointer group"
      onClick={() => router.push(`/movies/${movie.movieId}`)}
    >
      <Image
        src={`https://image.tmdb.org/t/p/w200${movie.moviePosterPath}`}
        alt={movie.movieTitle}
        width={80}
        height={120}
        className="w-16 h-24 object-cover rounded-md flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-white truncate">
          {movie.movieTitle}
        </h3>

        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
          {movie.voteAverage && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{movie.voteAverage.toFixed(1)}</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Added {new Date(movie.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <FavoriteButton
          movieId={movie.movieId}
          movieTitle={movie.movieTitle}
          moviePosterPath={movie.moviePosterPath}
          size="sm"
        />

        <Button
          size="sm"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(movie.movieId);
          }}
          className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/30"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
