import { brotliDecompress } from "zlib";
import {
    addProducer,
    updateProducer,
    deleteProducer,
    getAllProducers,
    getProducerById,
    getMoviesByProducer
} from "../services/producers.service";
import { Request, Response, NextFunction } from "express";


const addNewProducer = async (req: Request, res: Response, next: NextFunction):Promise<Response | void> =>{
    
    try{
        const {name, bornIn} : {name:string, bornIn: string} = req.body;

        const missingFields = [];
        if (!name) missingFields.push("name");
        if (!bornIn) missingFields.push("bornIn");

        if (missingFields.length > 0){
            return res.status(400).json({message: "Missing data!", missingFields});
        }

        const producer = await addProducer(name, bornIn);
        return res.status(201).json(producer);
    }catch(error:any){
        next(error);
    };
};

const updateCurrentProducer = async (req: Request, res: Response, next: NextFunction):Promise<Response | void> =>{
    
    try{
        const producerId = req.params.id;
        const {name, bornIn} : {name:string, bornIn: string} = req.body;

        const updatedProducer = await updateProducer(producerId, name, bornIn);

        return res.status(200).json(updatedProducer);

    }catch(error:any){
        next(error);
    };
};

const deleteCurrentProducer = async (req: Request, res: Response, next: NextFunction):Promise<Response | void> =>{
    
    try{
        const producerId = req.params.id;
        await deleteProducer(producerId);
        return res.status(200).json({message:"Producer deleted successfully!"}) 
    }catch(error:any){
        next(error);
    };
};

const getAllProds = async (req: Request, res: Response, next: NextFunction):Promise<Response | void> =>{
    
    try{
        const producers = await getAllProducers();
        return res.status(200).json(producers); 
    }catch(error:any){
        next(error);
    };
};

const getProdById = async (req: Request, res: Response, next: NextFunction):Promise<Response | void> =>{
    
    try{
        const producerId = req.params.id;
        const producer = await getProducerById(producerId);
        return res.status(200).json(producer); 
    }catch(error:any){
        next(error);
    };
};

/**
 * Get all movies by a producer
 */
const getProducerMovies = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const producerId = req.params.id;
        const movies = await getMoviesByProducer(producerId);
        return res.status(200).json(movies);
    } catch (error: any) {
        next(error);
    }
};

export {
    addNewProducer,
    updateCurrentProducer,
    deleteCurrentProducer,
    getAllProds,
    getProdById,
    getProducerMovies
}
