import { Router, Request, Response } from 'express';
import {filterImageFromURL, deleteLocalFiles} from '../../../../util/util';
import fs from "fs";
import path from "path";


const router: Router = Router();

const gallery = {
    url:"https://www.publicdomainpictures.net/pictures/",
    photos:[
        {
            id:1,
            path:"430000/velka/art-nouveau-vintage-kunst-16416644360b8.jpg"
        },
        {
            id:2,
            path:"450000/velka/woman-in-red-hat.jpg"
        }
    ]
}
// Get all photos in folder
router.get('/', async (req: Request, res: Response) => {
    let photos:string[] = [];
    const photoPath = path.join(`${__dirname}../../../../../../public`, 'photos');
    fs.readdir(photoPath, function (error, files) {
        
        if (error) {
             console.log('Failed to scan folder: ' + error);
             return;
        } 
        photos = files;

        res.status(201);
        res.send({
            status:"success",
            images:photos,
            url: `${req.get('host')}/photos`,
            path: photoPath,
            filterUrl:`${req.get('host')}/api/v0/photos/filteredimage` 
        });
        return;
        //listing all files using forEach
        // files.forEach(function (file) {
        //     // Do whatever you want to do with the file
        //     console.log(file); 
        // });
    });
    
    // res.send(photos);
});
http://localhost:8082/api/v0/photos/filteredimage?photo=mobile_banner.jpg
router.get('/filteredimage', async (req: Request, res: Response) => {
    const image = req.query.photo

    // const url = req.baseUrl
    // const filteredImage = filterImageFromURL(imagePath)
    // res.download(imagePath, function(err) {
    //     if(err) {
    //         console.log(err);
    //     }
    // })
    const fileDir =  `${__dirname}../../../../../../public/photos/${image}`;
    if (!fs.existsSync(fileDir)) {
        res.status(404);
        res.send('file not found');
    }
    try {
        const filteredFile = await filterImageFromURL(fileDir);
        res.sendFile(filteredFile)
        const deletFile = await deleteLocalFiles([fileDir])
        return;
    }catch(e){
        res.status(500);
        res.json({ error: 'Unable to get file' });
        return;
    }
    // res.status(201);
    // res.send(__dirname);
    // res.send(photos);
});

export const PhotoRouter: Router = router;