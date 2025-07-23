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

interface Genre {
  _id: string;
  name: string;
  genreId: number;
}

interface Mood {
  _id: string;
  name: string;
  genreIds: number[];
}