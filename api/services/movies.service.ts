import { dataSource } from "../config/database";
import { Movies } from "../models/movies.model";
import { Producer } from "../models/producers.model";

const movieRepository = dataSource.getRepository(Movies);
const producerRepository = dataSource.getRepository(Producer);

/**
 * Add a new movie
 */
const addMovie = async (
    movieName: string,
    madeIn: string,
    cost: number,
    producerId: string
) => {
    // Find the producer
    const producer = await producerRepository.findOne({ where: { id: producerId } });
    
    if (!producer) {
        throw new Error("Producer not found");
    }
    
    // Create new movie
    const newMovie = movieRepository.create({
        name: movieName,
        madeIn,
        cost,
        producer
    });
    
    // Save the movie
    const savedMovie = await movieRepository.save(newMovie);
    
    // Update the producer's moviesCount
    const moviesCount = await movieRepository.count({ where: { producer: { id: producerId } } });
    producer.moviesCount = moviesCount;
    await producerRepository.save(producer);
    
    return savedMovie;
};

/**
 * Update an existing movie
 */
const updateMovie = async (
    movieId: string,
    movieName?: string,
    madeIn?: string,
    cost?: number,
    producerId?: string
) => {
    // Find the movie
    const movie = await movieRepository.findOne({ 
        where: { id: movieId },
        relations: ['producer']
    });
    
    if (!movie) {
        throw new Error("Movie not found");
    }
    
    // Update movie properties if provided
    if (movieName) movie.name = movieName;
    if (madeIn) movie.madeIn = madeIn;
    if (cost) movie.cost = cost;
    
    // If producer is being changed
    if (producerId && movie.producer.id !== producerId) {
        const oldProducerId = movie.producer.id;
        
        // Find the new producer
        const newProducer = await producerRepository.findOne({ where: { id: producerId } });
        
        if (!newProducer) {
            throw new Error("New producer not found");
        }
        
        // Update the movie's producer
        movie.producer = newProducer;
        
        // Save the movie
        await movieRepository.save(movie);
        
        // Update both producers' moviesCount
        const oldProducer = await producerRepository.findOne({ where: { id: oldProducerId } });
        if (oldProducer) {
            const oldProducerMoviesCount = await movieRepository.count({ where: { producer: { id: oldProducerId } } });
            oldProducer.moviesCount = oldProducerMoviesCount;
            await producerRepository.save(oldProducer);
        }
        
        const newProducerMoviesCount = await movieRepository.count({ where: { producer: { id: producerId } } });
        newProducer.moviesCount = newProducerMoviesCount;
        await producerRepository.save(newProducer);
    } else {
        // Save the movie without changing producer counts
        await movieRepository.save(movie);
    }
    
    return movie;
};

/**
 * Delete a movie
 */
const deleteMovie = async (movieId: string) => {
    // Find the movie
    const movie = await movieRepository.findOne({ 
        where: { id: movieId },
        relations: ['producer']
    });
    
    if (!movie) {
        throw new Error("Movie not found");
    }
    
    const producerId = movie.producer.id;
    
    // Delete the movie
    await movieRepository.remove(movie);
    
    // Update the producer's moviesCount
    const producer = await producerRepository.findOne({ where: { id: producerId } });
    if (producer) {
        const moviesCount = await movieRepository.count({ where: { producer: { id: producerId } } });
        producer.moviesCount = moviesCount;
        await producerRepository.save(producer);
    }
    
    return { message: "Movie successfully deleted" };
};

/**
 * Get all movies
 */
const getAllMovies = async () => {
    return await movieRepository.find({ relations: ['producer'] });
};

/**
 * Get a movie by ID
 */
const getMovieById = async (movieId: string) => {
    const movie = await movieRepository.findOne({ 
        where: { id: movieId },
        relations: ['producer']
    });
    
    if (!movie) {
        throw new Error("Movie not found");
    }
    
    return movie;
};

/**
 * Get all movies by a producer
 */
const getMoviesByProducer = async (producerId: string) => {
    // Check if producer exists
    const producer = await producerRepository.findOne({ where: { id: producerId } });
    
    if (!producer) {
        throw new Error("Producer not found");
    }
    
    // Get all movies by this producer
    const movies = await movieRepository.find({ 
        where: { producer: { id: producerId } }
    });
    
    return movies;
};

export {
    addMovie,
    updateMovie,
    deleteMovie,
    getAllMovies,
    getMovieById,
    getMoviesByProducer
};
