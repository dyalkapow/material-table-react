export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster: string;
    releaseDate: string;
    voteAverage: number;
    genres: string[];
    runtime?: number;
    budget?: number;
    revenue?: number;
}
