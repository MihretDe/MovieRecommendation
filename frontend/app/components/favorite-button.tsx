"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import type { ApiResponse, CheckFavoriteResponse } from "../../types/api"

interface FavoriteButtonProps {
  movieId: string
  movieTitle: string
  moviePosterPath: string
  size?: "sm" | "md" | "lg"
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId, movieTitle, moviePosterPath, size = "md" }) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Get token from localStorage
  const getAuthToken = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token")
      
    }
    return null
  }

  // Check if movie is already favorited when component mounts
  useEffect(() => {
    const checkFavoriteStatus = async (): Promise<void> => {
      const token = getAuthToken()
      if (!token) return

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourite/${movieId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data: ApiResponse<CheckFavoriteResponse> = await response.json()
          setIsFavorite(data.data?.isFavorite || false)
        }
      } catch (error) {
        console.error("Error checking favorite status:", error)
      }
    }

    if (movieId) {
      checkFavoriteStatus()
    }
  }, [movieId])

  const handleFavoriteClick = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.stopPropagation()

    const token = getAuthToken()
    if (!token) {
      console.error("No auth token found")
      return
    }

    setIsLoading(true)

    try {
      if (isFavorite) {
        // Remove from favorites
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourite/${movieId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data: ApiResponse = await response.json()
        if (data.success) {
          setIsFavorite(false)
          console.log("Removed from favorites:", movieTitle)
        } else {
          throw new Error(data.error || "Failed to remove from favorites")
        }
      } else {
        // Add to favorites
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourite`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            movieId,
            movieTitle,
            moviePosterPath,
          }),
        })

        const data: ApiResponse = await response.json()
        if (data.success) {
          setIsFavorite(true)
          console.log("Added to favorites:", movieTitle)
        } else {
          throw new Error(data.error || "Failed to add to favorites")
        }
      }
    } catch (error) {
      console.error("Error updating favorites:", error)
      // You could add a toast notification here
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
