// Shared types between frontend and backend
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  error?: string
  data?: T
}

export interface FavoriteRequest {
  userId: string
  movieId: string
  movieTitle: string
  moviePosterPath: string
}

export interface FavoriteResponse {
  _id: string
  userId: string
  movieId: string
  movieTitle: string
  moviePosterPath: string
  createdAt: Date
}

export interface CheckFavoriteResponse {
  isFavorite: boolean
}
