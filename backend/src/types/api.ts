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
  createdAt: Date // Changed from string to Date to match IFavorite
}

export interface CheckFavoriteResponse {
  isFavorite: boolean
}
