export interface Movie {
  _id: string;
  movieId: number;
  title: string;
  overview: string;
  posterPath: string;
  releaseDate: string;
  runtime: number;
  popularity: number;
  voteAverage: number;
  voteCount: number;
  trailerKey: string;
  genres: Genre[];
  moods: Mood[];
}

export interface Genre {
  _id: string;
  name: string;
  genreId: number;
}

export interface Mood {
  _id: string;
  name: string;
  genreIds: number[];
}