import {Request, Response, Router} from "express";

export const addressesRouter = Router();


type Address = {
    id: number,
    value: string
}

const addresses: Address[] = [{id: 1, value: 'address 1'}, {id: 2, value: 'address 2'}]


addressesRouter.get("/", (req: Request, res: Response) => {
    res.send(addresses);
})

addressesRouter.get("/:value", (req: Request, res: Response) => {
    const value = req.params?.value
    let result = addresses.find(p => p.value === value);
    if (result) {
        res.send(result);
    } else {
        res.status(404).send("Not Found");
    }
})