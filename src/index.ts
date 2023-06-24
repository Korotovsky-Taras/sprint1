import express from "express";
import {productsRouter} from "./routes/products-router";
import {addressesRouter} from "./routes/addresses-router";

const app = express();

const parserMiddleware = express.json();

app.use(parserMiddleware)

const port = process.env.PORT || 3000;

app.use("/products", productsRouter)
app.use("/addresses", addressesRouter)

app.listen(port, () => {
    console.log(`App is running on port: ${port}`)
})