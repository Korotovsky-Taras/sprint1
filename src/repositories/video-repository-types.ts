export type ApiError = {
    errorsMessages: FieldError[]
}

export type FieldError = {
    message: string | null,
    field: string | null,
};

export enum Resolution {
    P144 = "P144",
    P240 = "P240",
    P360 = "P360",
    P480 = "P480",
    P720 = "P720",
    P1080 = "P1080",
    P1440 = "P1440",
    P2160 = "P2160"
}

export type AvailableResolution = Resolution[] | null;

export interface CreateVideoInputModel {
    title: string,
    author: string,
    availableResolutions: AvailableResolution,
}

export type AgeRestriction = number | null

export interface UpdateVideoInputModel extends CreateVideoInputModel {
    canBeDownloaded: boolean,
    minAgeRestriction: AgeRestriction,
    publicationDate: string,
}

export interface Video {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: AgeRestriction,
    createdAt: string,
    publicationDate: string,
    availableResolutions: AvailableResolution,
}
