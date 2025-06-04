import { dataSource } from "../config/database";
import { Producer } from "../models/producers.model";
import { Movies } from "../models/movies.model";
import { error } from "console";

const producerRepository = dataSource.getRepository(Producer);
const movieRepository = dataSource.getRepository(Movies);
/**
 * Add a new producer
 */
const addProducer = async (
    prodName: string, 
    prodBornIn: string
) => {
    // Check if producer already exists
    const foundProducer = await producerRepository.findOne({ where: { name: prodName } });
    
    if (!foundProducer) {
        // Create new producer with initial moviesCount of 0
        const newProducer = producerRepository.create({
            name: prodName,
            bornIn: prodBornIn,
            moviesCount: 0
        });

        return await producerRepository.save(newProducer);
    } else {
        console.error("Producer already exists");
        throw new Error("Producer already exists");
    }
};

const updateProducer = async (
    prodId: string,
    prodName:string, 
    prodBornIn: string, 
)=>{
    const currentProducer = await producerRepository.findOne({where: {id: prodId}});

    if(!currentProducer) throw new Error("Cannot find producer");

    currentProducer.name = prodName || currentProducer.name;
    currentProducer.bornIn = prodBornIn || currentProducer.bornIn;

    await producerRepository.save(currentProducer);

    return { message: 'Producer successfully updated', currentProducer};
};

const deleteProducer = async (prodId: string) => {

    const currentProducer = await producerRepository.findOne({where: {id: prodId}});
    
    if(!currentProducer) throw new Error("Cannot find producer");

    await producerRepository.delete(currentProducer);
    return { message: "Producer successfully deleted!"};
};

/**
 * Get all producers with their movie counts
 */
const getAllProducers = async () => {
    const producers = await producerRepository.find();
    
    // Update movie counts for all producers
    for (const producer of producers) {
        const moviesCount = await movieRepository.count({ 
            where: { producer: { id: producer.id } } 
        });
        
        // Only update if the count has changed
        if (producer.moviesCount !== moviesCount) {
            producer.moviesCount = moviesCount;
            await producerRepository.save(producer);
        }
    }
    
    return producers;
}

/**
 * Get a producer by ID and update their movie count
 */
const getProducerById = async (prodId: string) => {
    const currentProducer = await producerRepository.findOne({ where: { id: prodId } });

    if (!currentProducer) throw new Error("Cannot find producer");
    
    // Update the movies count
    const moviesCount = await movieRepository.count({ 
        where: { producer: { id: prodId } } 
    });
    
    // Only update if the count has changed
    if (currentProducer.moviesCount !== moviesCount) {
        currentProducer.moviesCount = moviesCount;
        await producerRepository.save(currentProducer);
    }
    
    return currentProducer;
};

/**
 * Get all movies by a producer
 */
const getMoviesByProducer = async (prodId: string) => {
    const producer = await producerRepository.findOne({ where: { id: prodId } });

    if (!producer) throw new Error("Cannot find producer");
    
    const movies = await movieRepository.find({ 
        where: { producer: { id: prodId } } 
    });
    
    return movies;
};

export {
    addProducer,
    updateProducer,
    deleteProducer,
    getAllProducers,
    getProducerById,
    getMoviesByProducer
};
