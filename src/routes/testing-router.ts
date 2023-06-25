import {Request, Response, Router} from "express";
import {productRepository} from "../repositories/product-repository";
import {videosRepository} from "../repositories/video-repository";

export const testingRouter = Router();

/**
 * Delete all testing data
 */
testingRouter.delete("/", (req: Request, res: Response) => {
    productRepository.clear();
    videosRepository.clear();
    return res.status(204).send();
})