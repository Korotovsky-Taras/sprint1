import {Request, Response, Router} from "express";
import {productRepository} from "../repositories/product-repository";

export const productsRouter = Router();

/**
 * Receive all products, or product by ${req.query.title}
 */
productsRouter.get("/", (req: Request, res: Response) => {
    if (req.query.title) {
        let titleString: string = "" + req.query.title;
        let product = productRepository.findProductByTitle(titleString);
        if (product) {
            res.send(product);
        }
        res.status(404).send("No Found");
    } else {
        let products = productRepository.getProducts();
        res.send(products);
    }
})

/**
 * Create product with ${req.body.title}
 */
productsRouter.post("/", (req: Request, res: Response) => {
    const productTitle = req.body.title?.trim();
    if (productTitle) {
        const product = productRepository.createProduct(productTitle);
        res.status(201).send(product)
    }
    res.status(400).send("title body param is missed")
})

/**
 * Update product by ${param.id}
 */
productsRouter.put("/:id", (req: Request, res: Response) => {
    const product = productRepository.findProductById(Number(req.params.id))
    if (product) {
        res.status(202).send(product)
    } else {
        res.send(404)
    }
})

/**
 * Delete product by ${param.id}
 */
productsRouter.delete("/:id", (req: Request, res: Response) => {
    const isDeleteSuccess = productRepository.deleteProductById(Number(req.params.id));
    if (isDeleteSuccess) {
        res.status(204).send();
    } else {
        res.send(404);
    }
})