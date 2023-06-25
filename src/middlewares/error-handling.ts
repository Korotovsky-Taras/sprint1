import {ApiError} from "../utils/ApiError";
import {NextFunction, Request, Response} from "express";

const ErrorHandling = (err: Error, req: Request, res: Response, next: NextFunction) =>  {
    if (err instanceof ApiError) {
        let response = res.status(err.status);
        if (err.errors) {
            return response.json({
                errorsMessages: err.errors,
            })
        }
        return response.send();
    }
    return res.status(500).json({ message: "Unhandled error" });
};

export default ErrorHandling;