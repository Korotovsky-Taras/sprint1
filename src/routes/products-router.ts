import {Request, Response, Router} from "express";
import {productRepository} from "../repositories/product-repository";

export const productsRouter = Router();


/**
 * Получение продукта
 * @{req.query.title}? - поиск по продукта по параметру title
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
 * Создание продукта
 * @{req.body.title} - принимает параметр body.title
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
 * Обновление продукта
 * @{:id} - id продукта
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
 * Удаление продукта
 * @{:id} - id продукта
 */
productsRouter.delete("/:id", (req: Request, res: Response) => {
    const isDeleteSuccess = productRepository.deleteProductById(Number(req.params.id));
    if (isDeleteSuccess) {
        res.status(204).send();
    } else {
        res.send(404);
    }
})