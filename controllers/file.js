import multer from "multer";
import "dotenv/config";
import { prisma } from "../lib/prisma.js";
import {v2 as cloudinary} from "cloudinary"
import { unlinkSync } from "node:fs";

const upload = multer({
    dest : 'uploads/',
    limits : {
        fileSize : 5 * 1024 * 1024
    }
});
cloudinary.config({
    cloud_name : process.env.CLOUD_NAME, 
    api_key : process.env.API_KEY,
    api_secret : process.env.API_SECRET
})

function renderUploadFile(req, res){
    res.render("uploadFile", {folderid : req.params.folderid});
}

const uploadFile = [
    upload.single('file'),
    async (req, res) => {
        try {
            const result = await cloudinary.uploader.upload( req.file.path, {
                public_id : String(Date.now()) + req.file.originalname.split(".")[0],
                type : "authenticated"
            })
            console.log(result);
            await prisma.file.create({
                data : {
                    name : req.file.originalname,
                    size : req.file.size,
                    type : req.file.mimetype,
                    public_id : result.public_id,
                    folderId: parseInt(req.params.folderid)
                }
            })
            res.redirect('/folder/' + req.params.folderid);
            unlinkSync(req.file.path, (err) => {
                if(err){throw err}
            });
        }
        catch(err){
            throw(err)
        }
    }
]

async function renderFileDetails(req, res){
    const file = await prisma.file.findUnique({
        where : {id : parseInt(req.params.fileid)},
        include: {folder : true}
    })
    const viewurl = cloudinary.url(file.public_id, {
        sign_url : true,
        type : "authenticated"
    })
    const downloadUrl = cloudinary.url(file.public_id, {
        flags : "attachment",
        sign_url : true,
        type : "authenticated"
    })
    res.render("fileDetails", {file : file, view : viewurl, download : downloadUrl});
}

export {
    renderUploadFile,
    uploadFile,
    renderFileDetails
}