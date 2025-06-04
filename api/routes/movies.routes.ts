import express from "express";
import {
    addNewMovie,
    updateCurrentMovie,
    deleteCurrentMovie,
    getAllMoviesController,
    getMovieByIdController,
    getMoviesByProducerController
} from '../controllers/movies.controller';

const router = express.Router();

// @ts-ignore
router.post("/", addNewMovie);

// @ts-ignore
router.get("/", getAllMoviesController);

// @ts-ignore
router.get("/producer/:producerId", getMoviesByProducerController);

// @ts-ignore
router.get("/:id", getMovieByIdController);

// @ts-ignore
router.patch("/:id", updateCurrentMovie);

// @ts-ignore
router.delete("/:id", deleteCurrentMovie);

export default router;
