import { prisma } from "../lib/prisma.js"


async function renderFolders(req, res){
    const folders = await prisma.folder.findMany({
        where : {userId : req.user.id}
    })
    res.render("folders", {folders : folders});
}

function renderCreateFolder(req, res){
    res.render("createFolder", {
        link : "/folder/create",
        action : "Create",
        folder : null
    });
}

async function createFolder(req, res){
    const {name} = req.body;
    await prisma.folder.create({
        data : {
            name : name,
            userId : req.user.id
        }
    })
    res.redirect('/');
}

async function renderFolderDetails(req, res){
    const folder = await prisma.folder.findUnique({
        where : { id : parseInt(req.params.id) },
        include : { files : true }
    })
    res.render("folderDetails", {folder});
}

async function deleteFolder(req, res){
    await prisma.folder.delete({
        where : {id : parseInt(req.params.id)}
    })
    res.redirect('/folder');
}

async function renderEditFolder(req, res){
    const folder = await prisma.folder.findUnique({
        where : {id : parseInt(req.params.id)}
    })
    res.render("createFolder", {
        link : "/folder/edit/" + folder.id,
        action : "Edit",
        folder : folder
    })
}

async function editFolder(req, res){
    await prisma.folder.update({
        data : { name : req.body.name },
        where : { id : parseInt(req.params.id) }
    })
    res.redirect('/folder/' + req.params.id);
}

export {
    renderFolders,
    renderCreateFolder,
    createFolder,
    renderFolderDetails,
    deleteFolder,
    renderEditFolder,
    editFolder
}