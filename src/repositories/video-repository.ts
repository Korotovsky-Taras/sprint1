import {CreateVideoInputModel, FieldError, UpdateVideoInputModel, Video} from "./video-repository-types";
import {
    ageRestrictionValidator,
    authorValidator,
    downloadedValidator,
    publishDateValidator,
    resolutionValidator,
    titleValidator
} from "./video-repository-validator";

const videoRepositoryInstance: Video[] = [];

const createVideosModel = (): Video[] => {
    if (process.env.NODE_ENV !== 'test') {
        return [...videoRepositoryInstance]
    }
    return [...videoRepositoryInstance]
}

const videos: Video[] = createVideosModel();

const generateId = () => {
    if (videos.length > 0) {
        let lastVideo = videos[videos.length - 1];
        return lastVideo.id + 1;
    }
    return 0;
}

export const videosRepository = {
    getVideos(): Video[] {
        return videos;
    },
    createVideo(input: CreateVideoInputModel): Video {
        const {title, author, availableResolutions} = input;

        const creationDate = new Date();
        const publicationDate = new Date(creationDate);
        publicationDate.setDate(publicationDate.getDate() + 1);

        const newVideo = {
            id: generateId(),
            title,
            author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: creationDate.toISOString(),
            publicationDate: publicationDate.toISOString(),
            availableResolutions
        };

        videos.push(newVideo);

        return newVideo;
    },
    updateVideo(video: Video, param: UpdateVideoInputModel): void {
        if (typeof param.title !== 'undefined') {
            video.title = param.title
        }
        if (typeof param.author !== 'undefined') {
            video.author = param.author
        }
        if (typeof param.availableResolutions !== 'undefined') {
            video.availableResolutions = param.availableResolutions
        }
        if (typeof param.canBeDownloaded !== 'undefined') {
            video.canBeDownloaded = param.canBeDownloaded
        }
        if (typeof param.minAgeRestriction !== 'undefined') {
            video.minAgeRestriction = param.minAgeRestriction
        }
        if (typeof param.publicationDate !== 'undefined') {
            video.publicationDate = param.publicationDate
        }
    },
    deleteVideoById(id: number): void {
        for (let i = 0; i < videos.length; i++) {
            if (videos[i].id === id) {
                videos.splice(i, 1);
                break;
            }
        }
    },
    getVideoById(id: number): Video | null {
        return videos.find(p => p.id === id) ?? null;
    },
    createVideoValidate(param: CreateVideoInputModel): FieldError[] {

        let errors: FieldError[] = [
            ...titleValidator(param.title, true),
            ...authorValidator(param.author, true)
        ];

        if (typeof param.availableResolutions !== 'undefined') {
            let items = resolutionValidator(param.availableResolutions);
            errors = errors.concat(items);
        }

        return errors;


    },
    updateVideoValidate(video: Video, param: UpdateVideoInputModel): FieldError[] {

        let errors: FieldError[] = [];

        if (typeof param.title !== 'undefined') {
            errors = errors.concat(titleValidator(param.title, false));
        }
        if (typeof param.author !== 'undefined') {
            errors = errors.concat(authorValidator(param.author, false));
        }
        if (typeof param.availableResolutions !== 'undefined') {
            errors = errors.concat(resolutionValidator(param.availableResolutions));
        }
        if (typeof param.canBeDownloaded !== 'undefined') {
            errors = errors.concat(downloadedValidator(param.canBeDownloaded));
        }
        if (typeof param.minAgeRestriction !== 'undefined') {
            errors = errors.concat(ageRestrictionValidator(param.minAgeRestriction));
        }
        if (typeof param.publicationDate !== 'undefined') {
            errors = errors.concat(publishDateValidator(param.publicationDate, video.createdAt));
        }

        return errors;
    },

    clear(): void {
        videos.splice(0, videos.length)
    }
}