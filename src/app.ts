import express from "express";
import {addressesRouter, productsRouter, testingRouter, videosRouter} from "./routes";
import errorHandling from "./middlewares/error-handling";

export const app = express();

app.use(express.json())
app.use("/products", productsRouter)
app.use("/addresses", addressesRouter)
app.use("/videos", videosRouter)
app.use("/testing/all-data", testingRouter)

app.use(errorHandling);

