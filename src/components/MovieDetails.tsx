import React, { useMemo } from 'react';
import {
    Typography,
    Box,
    Chip,
    Grid,
    useTheme,
    Divider
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import DateRangeIcon from '@mui/icons-material/DateRange';
import TimerIcon from '@mui/icons-material/Timer';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MovieIcon from '@mui/icons-material/Movie';
import { Movie } from '../types/movie';

interface MovieDetailsProps {
    movie: Movie;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie }) => {
    const theme = useTheme();

    const formatCurrency = (value: number): string => {
        if (!value) return 'Нет данных';
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(value);
    };

    const formatRuntime = (minutes: number): string => {
        if (!minutes) return 'Нет данных';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}ч ${mins}мин`;
    };

    const getRatingColor = (rating: number): string => {
        if (rating >= 8) return theme.palette.success.main;
        if (rating >= 6) return theme.palette.warning.main;
        return theme.palette.error.main;
    };

    const genreChips = useMemo(() => {
        if (!movie.genres || movie.genres.length === 0) {
            return (
                <Typography variant="body2" color="text.secondary">
                    Нет данных о жанрах
                </Typography>
            );
        }

        return movie.genres.map((genre, index) => (
            <Chip
                key={index}
                label={genre}
                color="primary"
                variant="outlined"
                size="small"
                icon={<MovieIcon />}
            />
        ));
    }, [movie.genres]);

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: getRatingColor(movie.voteAverage),
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 2,
                        mr: 2
                    }}
                >
                    <StarIcon sx={{ mr: 0.5 }} />
                    <Typography variant="h6" component="span">
                        {movie.voteAverage}
                    </Typography>
                </Box>

                <Typography
                    variant="subtitle1"
                    component="span"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: theme.palette.text.secondary
                    }}
                >
                    <DateRangeIcon sx={{ mr: 0.5 }} />
                    {new Date(movie.releaseDate).toLocaleDateString('ru-RU')}
                </Typography>
            </Box>

            <Typography
                variant="body1"
                paragraph
                sx={{
                    mb: 3,
                    lineHeight: 1.6,
                    color: theme.palette.text.primary
                }}
            >
                {movie.overview || 'Описание отсутствует.'}
            </Typography>

            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                    Жанры:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {genreChips}
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <TimerIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                        Продолжительность:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {formatRuntime(movie.runtime || 0)}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <AttachMoneyIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                        Бюджет:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {formatCurrency(movie.budget || 0)}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <AttachMoneyIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                        Сборы:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {formatCurrency(movie.revenue || 0)}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default React.memo(MovieDetails);
