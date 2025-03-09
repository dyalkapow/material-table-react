import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Box,
    useTheme,
    Divider
} from '@mui/material';
import { Movie } from '../types/movie';
import MovieDetails from './MovieDetails';

interface MovieModalProps {
    open: boolean;
    onClose: () => void;
    movie: Movie | null;
}

const MovieModal: React.FC<MovieModalProps> = ({ open, onClose, movie }) => {
    const theme = useTheme();

    if (!movie) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: 10,
                }
            }}
        >
            <DialogTitle
                sx={{
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    color: theme.palette.primary.main,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pb: 1
                }}
            >
                {movie.title}
            </DialogTitle>
            <Divider />
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Box
                            component="img"
                            src={movie.poster}
                            alt={movie.title}
                            sx={{
                                width: '100%',
                                borderRadius: 1,
                                boxShadow: 3
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <MovieDetails movie={movie} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    variant="contained"
                    color="primary"
                    sx={{ mb: 1, mr: 2 }}
                >
                    Закрыть
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default React.memo(MovieModal);
