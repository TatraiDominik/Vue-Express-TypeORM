import { Request, Response, NextFunction } from "express";
import {
    addMovie,
    updateMovie,
    deleteMovie,
    getAllMovies,
    getMovieById,
    getMoviesByProducer
} from "../services/movies.service";

/**
 * Add a new movie
 */
const addNewMovie = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { name, madeIn, cost, producerId } = req.body;
        
        // Validate required fields
        const missingFields = [];
        if (!name) missingFields.push("name");
        if (!madeIn) missingFields.push("madeIn");
        if (cost === undefined) missingFields.push("cost");
        if (!producerId) missingFields.push("producerId");
        
        if (missingFields.length > 0) {
            return res.status(400).json({ message: "Missing data!", missingFields });
        }
        
        const movie = await addMovie(name, madeIn, cost, producerId);
        return res.status(201).json(movie);
    } catch (error: any) {
        next(error);
    }
};

/**
 * Update an existing movie
 */
const updateCurrentMovie = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const movieId = req.params.id;
        const { name, madeIn, cost, producerId } = req.body;
        
        const updatedMovie = await updateMovie(movieId, name, madeIn, cost, producerId);
        return res.status(200).json(updatedMovie);
    } catch (error: any) {
        next(error);
    }
};

/**
 * Delete a movie
 */
const deleteCurrentMovie = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const movieId = req.params.id;
        const result = await deleteMovie(movieId);
        return res.status(200).json(result);
    } catch (error: any) {
        next(error);
    }
};

/**
 * Get all movies
 */
const getAllMoviesController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const movies = await getAllMovies();
        return res.status(200).json(movies);
    } catch (error: any) {
        next(error);
    }
};

/**
 * Get a movie by ID
 */
const getMovieByIdController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const movieId = req.params.id;
        const movie = await getMovieById(movieId);
        return res.status(200).json(movie);
    } catch (error: any) {
        next(error);
    }
};

/**
 * Get all movies by a producer
 */
const getMoviesByProducerController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const producerId = req.params.producerId;
        const movies = await getMoviesByProducer(producerId);
        return res.status(200).json(movies);
    } catch (error: any) {
        next(error);
    }
};

export {
    addNewMovie,
    updateCurrentMovie,
    deleteCurrentMovie,
    getAllMoviesController,
    getMovieByIdController,
    getMoviesByProducerController
};
