import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Container,
    CssBaseline,
    ThemeProvider,
    createTheme,
    Box,
    IconButton,
    Typography,
    Modal,
    Paper
} from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
} from '@mui/x-data-grid';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Movie } from './types/movie';
import { fetchMovies } from './services/movieService';

const App: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    // const [openModal, setOpenModal] = useState<boolean>(false);
    const [openImageModal, setOpenImageModal] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<string>('');


    const theme = useMemo(() => createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    }), [darkMode]);

    useEffect(() => {
        const getMovies = async () => {
            try {
                const data = await fetchMovies();
                setMovies(data);
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setLoading(false);
            }
        };

        getMovies();
    }, []);

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    const toggleDarkMode = useCallback(() => {
        setDarkMode(prevMode => !prevMode);
    }, []);

    const handleImageClick = useCallback((event: React.MouseEvent, imageUrl: string) => {
        event.stopPropagation();
        setSelectedImage(imageUrl);
        setOpenImageModal(true);
    }, []);

    const getRatingColor = useCallback((rating: number): string => {
        if (rating >= 8) return '#388e3c';
        if (rating >= 6) return '#f57c00';
        return '#d32f2f';
    }, []);

    const columns: GridColDef[] = useMemo(() => [
        {
            field: 'poster',
            headerName: 'Постер',
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params: GridRenderCellParams) => (
                <Box
                    component="img"
                    sx={{
                        height: 80,
                        width: 'auto',
                        maxWidth: 120,
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        '&:hover': {
                            transform: 'scale(1.05)',
                        }
                    }}
                    src={params.value as string}
                    alt={`${params.row.title} poster`}
                    onClick={(e) => handleImageClick(e, params.value as string)}
                />
            )
        },
        {
            field: 'title',
            headerName: 'Название',
            width: 250,
            renderCell: (params: GridRenderCellParams) => (
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 'bold',
                        color: theme.palette.primary.main,
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                    }}
                >
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'overview',
            headerName: 'Описание',
            width: 400,
            renderCell: (params: GridRenderCellParams) => (
                <Typography
                    variant="body2"
                    sx={{
                        fontStyle: 'italic',
                        color: theme.palette.text.secondary,
                        fontSize: '0.9rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                    }}
                >
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'releaseDate',
            headerName: 'Дата выхода',
            width: 150,
            type: 'date',
            valueFormatter: ({ value }) => {
                if (!value) return '';
                return new Date(value as string).toLocaleDateString('ru-RU');
            },
            renderCell: (params: GridRenderCellParams) => (
                <Typography
                    variant="body2"
                    sx={{
                        fontFamily: 'monospace',
                        color: theme.palette.secondary.main
                    }}
                >
                    {new Date(params.value as string).toLocaleDateString('ru-RU')}
                </Typography>
            )
        },
        {
            field: 'voteAverage',
            headerName: 'Рейтинг',
            width: 120,
            type: 'number',
            renderCell: (params: GridRenderCellParams) => (
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 'bold',
                        backgroundColor: getRatingColor(params.value as number),
                        padding: '4px 8px',
                        borderRadius: '12px',
                        color: '#fff'
                    }}
                >
                    {params.value}
                </Typography>
            )
        },
    ], [theme, handleImageClick, getRatingColor]);

    const handleCloseImageModal = useCallback(() => {
        setOpenImageModal(false);
    }, []);


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Каталог фильмов
                    </Typography>
                    <IconButton onClick={toggleDarkMode} color="inherit">
                        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Box>

                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <DataGrid
                        rows={movies}
                        columns={columns}
                        getRowId={(row) => row.id}
                        loading={loading}
                        getRowHeight={() => 'auto'}
                        getEstimatedRowHeight={() => 100}
                        pageSizeOptions={[5, 10, 20]}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 },
                            },
                        }}
                        sx={{
                            '& .MuiDataGrid-cell': {
                                py: 2,
                                minHeight: '100px !important',
                                maxHeight: '300px !important',
                                whiteSpace: 'normal !important',
                                alignItems: 'center',
                                display: 'flex',
                                justifyContent: 'center'
                            },
                            '& .MuiDataGrid-row': {
                                cursor: 'pointer',
                            },
                        }}
                    />
                </Paper>

                <Modal
                    open={openImageModal}
                    onClose={handleCloseImageModal}
                    aria-labelledby="image-modal"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        component="img"
                        src={selectedImage}
                        alt="Movie poster"
                        sx={{
                            maxWidth: '80%',
                            maxHeight: '80%',
                            boxShadow: 24,
                        }}
                        onClick={handleCloseImageModal}
                    />
                </Modal>
            </Container>
        </ThemeProvider>
    );
};

export default App;
