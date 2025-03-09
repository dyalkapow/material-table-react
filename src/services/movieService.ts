import axios from 'axios';
import { Movie } from '../types/movie';

const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const api = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
        language: 'ru-RU'
    }
});

export const fetchMovies = async (): Promise<Movie[]> => {
    try {
        const { data } = await api.get('/movie/popular', {
            params: { page: 1 }
        });

        const movies: Movie[] = data.results.map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            overview: movie.overview || 'Описание отсутствует',
            poster: movie.poster_path
                ? `${IMG_BASE_URL}${movie.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image',
            releaseDate: movie.release_date,
            voteAverage: movie.vote_average.toFixed(1),
            genres: movie.genre_ids || [],
            runtime: 0,
            budget: 0,
            revenue: 0
        }));

        return await Promise.all(
            movies.map(async (movie) => {
                try {
                    const { data: detailsData } = await api.get(`/movie/${movie.id}`);

                    return {
                        ...movie,
                        genres: detailsData.genres.map((genre: any) => genre.name),
                        runtime: detailsData.runtime,
                        budget: detailsData.budget,
                        revenue: detailsData.revenue
                    };
                } catch (error) {
                    console.error(`Error fetching details for movie ${movie.id}:`, error);
                    return movie;
                }
            })
        );
    } catch (error) {
        console.error('Error fetching movies:', error);
        return getMockMovies();
    }
};

const getMockMovies = (): Movie[] => {
    return [
        {
            id: 1,
            title: 'Начало',
            overview: 'Кобб – талантливый вор, лучший из лучших в опасном искусстве извлечения: он крадет ценные секреты из глубин подсознания во время сна, когда человеческий разум наиболее уязвим.',
            poster: 'https://via.placeholder.com/500x750?text=Inception',
            releaseDate: '2010-07-16',
            voteAverage: 8.4,
            genres: ['Фантастика', 'Боевик', 'Триллер'],
            runtime: 148,
            budget: 160000000,
            revenue: 836800000
        },
        {
            id: 2,
            title: 'Интерстеллар',
            overview: 'Наше время на Земле подошло к концу, команда исследователей берет на себя самую важную миссию в истории человечества; путешествуя за пределами нашей галактики, чтобы узнать есть ли у человечества будущее среди звезд.',
            poster: 'https://via.placeholder.com/500x750?text=Interstellar',
            releaseDate: '2014-11-07',
            voteAverage: 8.6,
            genres: ['Фантастика', 'Драма', 'Приключения'],
            runtime: 169,
            budget: 165000000,
            revenue: 677500000
        },
        {
            id: 3,
            title: 'Темный рыцарь',
            overview: 'С помощью лейтенанта Джима Гордона и нового окружного прокурора Харви Дента Бэтмен намерен уничтожить преступность в Готэме. Но вскоре их объединенные силы подвергаются испытанию появлением Джокера – криминального гения, ставящего перед городом новую угрозу.',
            poster: 'https://via.placeholder.com/500x750?text=The+Dark+Knight',
            releaseDate: '2008-07-18',
            voteAverage: 9.0,
            genres: ['Боевик', 'Криминал', 'Драма'],
            runtime: 152,
            budget: 185000000,
            revenue: 1000000000
        },
        {
            id: 4,
            title: 'Матрица',
            overview: 'Компьютерный хакер узнает от таинственных повстанцев о реальном мире, скрытом искусственной действительностью, и о своей роли в войне против контролирующих её машин.',
            poster: 'https://via.placeholder.com/500x750?text=The+Matrix',
            releaseDate: '1999-03-31',
            voteAverage: 8.7,
            genres: ['Боевик', 'Фантастика'],
            runtime: 136,
            budget: 63000000,
            revenue: 465000000
        },
        {
            id: 5,
            title: 'Бойцовский клуб',
            overview: 'Страдающий от бессонницы клерк и безжалостный торговец мылом заводят подпольный бойцовский клуб, который развивается в нечто совершенно иное.',
            poster: 'https://via.placeholder.com/500x750?text=Fight+Club',
            releaseDate: '1999-10-15',
            voteAverage: 8.8,
            genres: ['Драма', 'Триллер'],
            runtime: 139,
            budget: 63000000,
            revenue: 100900000
        },
        {
            id: 6,
            title: 'Престиж',
            overview: 'После трагического инцидента два фокусника-соперника начинают дикую битву, чтобы создать иллюзию, которая изменит реальность.',
            poster: 'https://via.placeholder.com/500x750?text=The+Prestige',
            releaseDate: '2006-10-20',
            voteAverage: 8.5,
            genres: ['Драма', 'Мистика', 'Триллер'],
            runtime: 130,
            budget: 40000000,
            revenue: 109700000
        },
        {
            id: 7,
            title: 'Назад в будущее',
            overview: 'Марти МакФлай, подросток из 1985 года, случайно попадает в прошлое, в 1955 год. Там он встречает своих будущих родителей, еще подростков, и случайно нарушает их первую встречу. Теперь он должен удостовериться, что его родители встретятся и влюбятся, иначе он сам перестанет существовать.',
            poster: 'https://via.placeholder.com/500x750?text=Back+to+the+Future',
            releaseDate: '1985-07-03',
            voteAverage: 8.5,
            genres: ['Фантастика', 'Комедия', 'Приключения'],
            runtime: 116,
            budget: 19000000,
            revenue: 388800000
        },
        {
            id: 8,
            title: 'Гладиатор',
            overview: 'Генерал Максимус, величайший полководец Рима, стал рабом, сражающимся на арене гладиаторов, чтобы отомстить коварному императору Коммоду за убийство своей семьи.',
            poster: 'https://via.placeholder.com/500x750?text=Gladiator',
            releaseDate: '2000-05-05',
            voteAverage: 8.5,
            genres: ['Боевик', 'Драма', 'Приключения'],
            runtime: 155,
            budget: 103000000,
            revenue: 460500000
        }
    ];
};
