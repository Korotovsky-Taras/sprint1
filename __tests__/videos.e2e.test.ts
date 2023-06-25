import request from "supertest";
import {app} from "../src/app";
import {Resolution} from "../src/repositories/video-repository-types";
import {videosRepository} from "../src/repositories/video-repository";

describe("/videos", () => {

    afterAll(async () => {
        await request(app)
            .delete("/testing/all-data");
        console.log("test data clean")
    })

    it("should create video", async () => {
        await request(app)
            .post("/videos")
            .send({ title: 'Home video', author: 'Taras', availableResolutions: [Resolution.P240, Resolution.P360] })
            .set('Content-Type', 'application/json')
            .expect(201)
            .then(res => {
                expect(res.body).not.toBeNull();
                expect(videosRepository.getVideos()).toContainEqual(res.body);
            })
    })

    it("should delete video", async () => {
        await request(app)
            .delete("/videos/0")
            .expect(204)
            .then(res => {
                expect(videosRepository.getVideos().some(({id}) => id === 0)).toBe(false);
            })
    })

    it("should create video with default resolution", async () => {
        await request(app)
            .post("/videos")
            .send({ title: 'Home video', author: 'Taras'})
            .set('Content-Type', 'application/json')
            .expect(201)
            .then(res => {
                expect(res.body).not.toBeNull();
                expect(res.body?.availableResolutions).not.toBeNull();
                expect(res.body.availableResolutions.every((resolution: Resolution) => Object.values(Resolution).includes(resolution))).toBe(true)
            })
    })


    it("should update video", async () => {
        const updateData = {
            title: "title",
            author: "author",
            availableResolutions: ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"],
            canBeDownloaded: false,
            minAgeRestriction: 18,
            publicationDate: new Date().toISOString()
        }
        await request(app)
            .put("/videos/0")
            .send(updateData)
            .set('Content-Type', 'application/json')
            .expect(204)
            .then(res => {
                const video = videosRepository.getVideoById(0)
                expect(video?.title).toEqual(updateData.title);
                expect(video?.author).toEqual(updateData.author);
                expect(video?.availableResolutions).toEqual(updateData.availableResolutions);
                expect(video?.canBeDownloaded).toEqual(updateData.canBeDownloaded);
                expect(video?.minAgeRestriction).toEqual(updateData.minAgeRestriction);
                expect(video?.publicationDate).toEqual(updateData.publicationDate);
            })
    })

    it("should create video with null resolution", async () => {
        await request(app)
            .post("/videos")
            .send({ title: 'Home video', author: 'Taras', availableResolutions: null})
            .set('Content-Type', 'application/json')
            .expect(201)
            .then(res => {
                expect(res.body).not.toBeNull();
                expect(res.body?.availableResolutions).not.toBeNull();
                expect(res.body?.availableResolutions.every((resolution: Resolution) => Object.values(Resolution).includes(resolution))).toBe(true)
            })
    })

    it("should not create video with large title", async () => {
        await request(app)
            .post("/videos")
            .send({ title: 'Home video, length of title more then need\n' +
                    'Home video, length of title more then need\n' +
                    'Home video, length of title more then need\n',
                author: 'Taras'})
            .set('Content-Type', 'application/json')
            .expect(400)
            .then(res => {
                expect(res.body).not.toBeNull();
                expect(res.body?.errorsMessages).not.toBeNull();
                expect(res.body?.errorsMessages.some((err: any) => err.field === "title")).toBe(true);
            })
    })

    it("should not create video with large author", async () => {
        await request(app)
            .post("/videos")
            .send({ title: 'title',
                author: 'Author more then eighteen letters long'})
            .set('Content-Type', 'application/json')
            .expect(400)
            .then(res => {
                expect(res.body).not.toBeNull();
                expect(res.body?.errorsMessages).not.toBeNull();
                expect(res.body?.errorsMessages.some((err: any) => err.field === "author")).toBe(true);
            })
    })

})