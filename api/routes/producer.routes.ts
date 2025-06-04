import express from "express";
import {
    addNewProducer,
    updateCurrentProducer,
    deleteCurrentProducer,
    getAllProds,
    getProdById,
    getProducerMovies
} from '../controllers/producer.controller';

const router = express.Router();

// @ts-ignore
router.post("/addProd", addNewProducer);

// @ts-ignore
router.patch("/:id", updateCurrentProducer);

// @ts-ignore
router.delete("/:id", deleteCurrentProducer);

// @ts-ignore
router.get("/", getAllProds);

// @ts-ignore
router.get("/:id/movies", getProducerMovies);

// @ts-ignore
router.get("/:id", getProdById);

export default router;
