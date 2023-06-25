import {AgeRestriction, AvailableResolution, FieldError, Resolution} from "./video-repository-types";
import {isDate} from "../utils/Date";

function videoRepositoryValidator(name: string, field: any) {
    const errors: FieldError[] = [];
    const addError = (message: string) => {
        errors.push({message, field: name})
    }
    return {
        isBoolean() {
            if (typeof field !== "boolean") {
                addError(`field ${name} should be a boolean`)
            }
            return this;
        },
        isString() {
            if (typeof field !== "string") {
                addError(`field ${name} should be a string`)
            }
            return this;
        },
        isNumber() {
            if (typeof field !== "number") {
                addError(`field ${name} should be a number`)
            }
            return this;
        },
        isType(types: any[]) {
            if (!types.includes(field) && !types.includes(typeof field)) {
                addError(`field ${name} should be a typeof ${types.map(String)}`)
            }
            return this;
        },
        isDate() {
            if (!isDate(field)) {
                addError(`field ${name} should be an date format`)
            }
            return this;
        },
        isDateAfter(date: Date) {
            if (isDate(field) && new Date(field).getTime() < date.getTime()) {
                addError(`date of ${name} must be greater then ${date}`)
            }
            return this;
        },
        required() {
            if (field === null
                || field === undefined
                || typeof field === "string" && field === "") {
                addError(`field ${name} is required`)
            }
            return this;
        },
        min(value: number) {
            if (typeof field === "number" && value > field) {
                addError(`min value of ${name} is ${value}`)
            }
            return this;
        },
        max(value: number) {
            if (typeof field === "number" && value < field) {
                addError(`max value of ${name} is ${value}`)
            }
            return this;
        },
        maxLength(length: number) {
            if (typeof field === "string" && field.length > length) {
                addError(`length of ${name} should be less then ${length}`)
            }
            return this;
        },
        includes<T>(arr: T[]) {
            if (!arr.includes(field)) {
                addError(`incorrect value ${field} should be one of ${arr.toString()}`)
            }
            return this;
        },
        allowValues(arr: any[]) {
            if (!arr.includes(field)) {
                addError(`incorrect type of ${field}`)
            }
            return this;
        },
        validate(): FieldError[] {
            return errors;
        }
    }
}

export const titleValidator = (title: string, isRequired: boolean): FieldError[] => {
    let validator = videoRepositoryValidator("title", title);
    if (isRequired) {
        validator.required()
    }
    validator.isString().maxLength(40);
    return [
        ...validator.validate()
    ];
}

export const authorValidator = (author: string, isRequired: boolean): FieldError[] => {
    let validator = videoRepositoryValidator("author", author);
    if (isRequired) {
        validator.required()
    }
    validator.isString().maxLength(20);
    return [
        ...validator.validate()
    ];
}

export const resolutionValidator = (resolutions: AvailableResolution): FieldError[] => {
    let resolutionErrors: FieldError[] = [];

    if (Array.isArray(resolutions)) {
        resolutions.forEach((resolution) => {
            const resolutionsValidator = videoRepositoryValidator("availableResolutions", resolution);
            resolutionErrors = [
                ...resolutionErrors,
                ...resolutionsValidator.includes<string>(Object.values(Resolution)).validate()
            ]
        })
    } else {
        const resolutionsValidator = videoRepositoryValidator("availableResolutions", resolutions);
        resolutionErrors = [
            ...resolutionsValidator.allowValues([null, undefined]).validate()
        ]
    }
    return [
        ...resolutionErrors
    ];
}


export const downloadedValidator = (downloaded: boolean): FieldError[] => {
    let validator = videoRepositoryValidator("canBeDownloaded", downloaded);
    validator.isBoolean();
    return [
        ...validator.validate()
    ];
}

export const ageRestrictionValidator = (ageRestriction: AgeRestriction): FieldError[] => {
    let validator = videoRepositoryValidator("minAgeRestriction", ageRestriction);
    validator.isType(["number", null]).min(1).max(18)
    return [
        ...validator.validate()
    ];
}
export const publishDateValidator = (publishDate: string, createdAtDate: string): FieldError[] => {
    let validator = videoRepositoryValidator("publicationDate", publishDate);
    validator.isDate().isDateAfter(new Date(createdAtDate))
    return [
        ...validator.validate()
    ];
}