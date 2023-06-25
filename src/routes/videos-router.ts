import {Request, Response, Router} from "express";
import {videosRepository} from "../repositories/video-repository";
import {Resolution} from "../repositories/video-repository-types";
import {ApiError} from "../utils/ApiError";

export const videosRouter = Router();

/**
 * Returns all videos
 */
videosRouter.get("/", (req: Request, res: Response) => {
    return res.status(200).send(videosRepository.getVideos())
})

/**
 * Return video by param id
 */
videosRouter.get("/:id", (req: Request, res: Response) => {
    const video = videosRepository.getVideoById(Number(req.params.id));
    if (!video) {
        throw new ApiError(400, null)
    }
    return res.status(200).send(video)
})

/**
 * Update existing video by id, with InputModel
 */
videosRouter.put("/:id", (req: Request, res: Response) => {
    const {id} = req.params;
    const {
        title,
        author,
        availableResolutions,
        canBeDownloaded,
        minAgeRestriction,
        publicationDate
    } = req.body;
    const video = videosRepository.getVideoById(Number(id))

    if (!video) {
        throw new ApiError(404, null);
    }

    const errors = videosRepository.updateVideoValidate(video, {
        title,
        author,
        availableResolutions,
        canBeDownloaded,
        minAgeRestriction,
        publicationDate
    });

    if (errors.length > 0) {
        throw new ApiError(400, errors);
    }

    videosRepository.updateVideo(video, {
        title,
        author,
        availableResolutions,
        canBeDownloaded,
        minAgeRestriction,
        publicationDate
    })

    return res.status(204).send();
})

/**
 * Create new video
 */
videosRouter.post("/", (req: Request, res: Response) => {
    const {title, author, availableResolutions} = req.body;

    const errors = videosRepository.createVideoValidate({title, author, availableResolutions})

    if (errors.length > 0) {
        throw new ApiError(400, errors);
    }

    const resolutions = Array.isArray(availableResolutions) ? availableResolutions : []

    if (resolutions.length === 0) {
        resolutions.push(Resolution.P144)
    }

    const video = videosRepository.createVideo({
        title,
        author,
        availableResolutions: resolutions,
    })

    return res.status(201).send(video);
})

/**
 * Delete video by id
 */
videosRouter.delete("/:id", (req: Request, res: Response) => {
    const video = videosRepository.getVideoById(Number(req.params.id));
    if (!video) {
        throw new ApiError(404, null)
    }
    videosRepository.deleteVideoById(video.id);
    return res.status(204).send()

})