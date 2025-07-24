"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import type { ApiResponse, CheckFavoriteResponse } from "../../types/api"

// Redux imports
import { useDispatch, useSelector } from "react-redux"
import {
  addFavourite,
  removeFavourite,
  fetchFavourites,
} from "@/lib/feauters/favourites/favouritesSlice"
import { RootState, AppDispatch } from "@/lib/store"

interface FavoriteButtonProps {
  movieId: string
  movieTitle: string
  moviePosterPath: string
  size?: "sm" | "md" | "lg"
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  movieId,
  movieTitle,
  moviePosterPath,
  size = "md",
}) => {
  const dispatch: AppDispatch = useDispatch()
  const { favourites } = useSelector((state: RootState) => state.favourites)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Check if movie is already favorited
  const isFavorite = favourites.some((fav) => fav.movieId === movieId)

  useEffect(() => {
    // Optionally fetch favourites on mount if not already loaded
    if (!favourites.length) {
      dispatch(fetchFavourites())
    }
  }, [dispatch, favourites.length])

  const handleFavoriteClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.stopPropagation()
    setIsLoading(true)
    try {
      if (isFavorite) {
        await dispatch(removeFavourite(movieId)).unwrap()
      } else {
        await dispatch(
          addFavourite({ movieId, movieTitle, moviePosterPath })
        ).unwrap()
      }
    } catch (error) {
      // Optionally handle error (e.g., toast)
    } finally {
      setIsLoading(false)
    }
  }

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  const buttonSizeClasses = {
    sm: "p-2",
    md: "p-3",
    lg: "p-4",
  }

  return (
    <button
      onClick={handleFavoriteClick}
      disabled={isLoading}
      className={`${buttonSizeClasses[size]} rounded-full bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700/50`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`${sizeClasses[size]} transition-all duration-200 ${
          isFavorite ? "fill-red-500 text-red-500" : "text-gray-300 hover:text-red-400"
        } ${isLoading ? "animate-pulse" : ""}`}
      />
    </button>
  )
}

export default FavoriteButton
            