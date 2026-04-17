import { Router } from "express";
import { renderFileDetails, renderUploadFile, uploadFile } from "../controllers/file.js";

const fileRouter = Router({mergeParams: true});

fileRouter.get('/upload', (req, res) => {
    renderUploadFile(req, res);
})

fileRouter.post('/upload', uploadFile);

fileRouter.get('/:fileid', async (req, res) => {
    await renderFileDetails(req, res);
})

export default fileRouter