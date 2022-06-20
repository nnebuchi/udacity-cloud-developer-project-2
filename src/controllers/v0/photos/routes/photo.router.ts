import { Router, Request, Response } from 'express';
import {filterImageFromURL, deleteLocalFiles} from '../../../../util/util';
import fs from "fs";
import path from "path";


const router: Router = Router();

const gallery = [
    {
        id:1,
        name:"Golden Boy",
        path:"photos/avatar.png"
    },
    {
        id:2,
        name:"Art in Heaven",
        path:"photos/profile-pic-.png"
    }
];


// Get all photos in folder
router.get('/', async (req: Request, res: Response) => {
   
    res.status(201);
    res.json({
        status:"success",
        photos:gallery,
        filterUrl:`${req.get('host')}/api/v0/photos/filteredimage?image_url=` 
    });
    return;
   
});


router.get('/filteredimage', async (req: Request, res: Response) => {

    const query = req.query;

    if(!query.image_url){
        res.status(404).send('not found');
        return;
    }

    try {
        // filter image
        const filteredFile = await filterImageFromURL(query.image_url);
        // send file to client side
        res.status(200).sendFile(filteredFile);
        
        const photoPath =  './src/util/tmp';
        // scan folder where photos are temporarily saved
        fs.readdir(photoPath, function (error, files) {
        
            if (error) {
                 console.log('Failed to scan folder for file deletion: ' + error);
                 return;
            } 
            // create an array of file paths from the scanned files
            files.forEach(function (file, index) {

                files[index] = `${photoPath}/${file}`
                    
            });
            // delete files by passing an array of file paths
            try{
                deleteLocalFiles(files);
                console.log('local files deleted');
                return;
            } catch(err){
                console.log(`could not delete file: ${err}`);
                return;
            }
        });
        
    }catch(e){
        res.status(500);
        res.json({ error: 'Unable to get file' });
        return;
    }
   
});

export const PhotoRouter: Router = router;