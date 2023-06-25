import {productRepository} from "../src/repositories/product-repository";
import request from "supertest";
import {app} from "../src/app";

describe("/products", () => {

    it("should create product", async () => {
        await request(app)
            .post("/products")
            .send({ title: 'josh' })
            .set('Content-Type', 'application/json')
            .expect(201)
            .then(res => {
                expect(res.body).not.toBeNull();
                expect(productRepository.getProducts()).toContainEqual(res.body);
            })
    })


    it("should delete product", async () => {
        await request(app)
            .delete("/products/1")
            .expect(204)
            .then(res => {
                expect(res.body).toEqual({});
                expect(productRepository.getProducts().some(({id}) => id === 1)).toBe(false);
            })
    })

})