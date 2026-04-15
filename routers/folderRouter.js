import { Router } from "express";
import { renderFolders, renderCreateFolder, createFolder, renderFolderDetails, deleteFolder, renderEditFolder, editFolder } from "../controllers/folder.js";

const folderRouter = Router();

folderRouter.get('/', async (req, res) => {
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }
    await renderFolders(req, res);
})

folderRouter.get('/create', (req, res) => {
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }
    renderCreateFolder(req, res);
})

folderRouter.post('/create', (req, res) => {
    createFolder(req, res);
})

folderRouter.get('/:id', async (req, res) => {
    await renderFolderDetails(req, res);
})

folderRouter.post('/delete/:id', async (req, res) => {
    await deleteFolder(req, res);
})

folderRouter.get('/edit/:id', async (req, res) => {
    await renderEditFolder(req, res);
})

folderRouter.post('/edit/:id', async (req, res) => {
    await editFolder(req, res);
})

export default folderRouter;