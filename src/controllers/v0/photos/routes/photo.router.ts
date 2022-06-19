import { Router, Request, Response } from 'express';
import {filterImageFromURL, deleteLocalFiles} from '../../../../util/util';
import fs from "fs";
import path from "path";
import * as AWS from '../../../../aws';

const router: Router = Router();

const gallery = [
    {
        id:1,
        file:"image-1.jpg",
        path:"photos/avatar.png"
    },
    {
        id:2,
        file:"profile-pic-.png",
        path:"photos/profile-pic-.png"
    }
];

// Get a signed url to put a new item in the bucket
router.get('/signed-url/:fileName', async (req: Request, res: Response) => {
    let { fileName } = req.params;
    const url = AWS.getPutSignedUrl(fileName);
    res.status(201).send({url: url});
});


// Get a signed url to get an item in the bucket
router.get('/get-item-signed-url/:folder/:fileName', async (req: Request, res: Response) => {
    const objectUrl = `${req.params.folder}/${req.params.fileName}`;
    // let params  = req.params;
    // res.status(201).send(objectUrl);
    // return;
    const url = AWS.getGetSignedUrl(objectUrl);
    res.status(201).send({url: url});
});

// loop through photo array to get signed url
const getSignedUrl = (value:any,index:number)=>{
    const url = AWS.getGetSignedUrl(value.path); 
    value.signed_url = url;
    return; 
}

// Get all photos in folder
router.get('/', async (req: Request, res: Response) => {
    // let photos:string[] = [];
    // const photoPath = path.join(`${__dirname}../../../../../../public`, 'photos');
    
    

    gallery.forEach(getSignedUrl);
    res.status(201);
    res.json({
        status:"success",
        photos:gallery,
        // images:gallery,
        // url: `${req.get('host')}/photos`,
        // path: photoPath,
        filterUrl:`${req.get('host')}/api/v0/photos/filteredimage` 
    });
    return;
    // fs.readdir(photoPath, function (error, files) {
        
    //     if (error) {
    //          console.log('Failed to scan folder: ' + error);
    //          return;
    //     } 
    //     photos = files;

    //     res.status(201);
    //     res.send({
    //         status:"success",
    //         images:photos,
    //         url: `${req.get('host')}/photos`,
    //         path: photoPath,
    //         filterUrl:`${req.get('host')}/api/v0/photos/filteredimage` 
    //     });
    //     return;
    //     //listing all files using forEach
    //     // files.forEach(function (file) {
    //     //     // Do whatever you want to do with the file
    //     //     console.log(file); 
    //     // });
    // });
    
    // res.send(photos);
});
// http://localhost:8082/api/v0/photos/filteredimage?photo=mobile_banner.jpg



router.get('/filteredimage', async (req: Request, res: Response) => {
    // fs.writeFileSync( file, data, options )
    const img = await filterImageFromURL(req.query.image_url);
        res.sendFile(img)
        // const deletFile = await deleteLocalFiles([joinedQquery])
        return;
    const query = req.query;
     let joinedQquery ='';
    for (const key in query) {

        console.log(`${key}: ${query[key]}`);
        joinedQquery+='?'+key+'='+query[key];
    }
    joinedQquery = joinedQquery.substring(1);
    joinedQquery =joinedQquery.replace('image_url=https://', '');
  
    // const joinQuery = (value:string, index:string)=>{
    //     joinedQquery+='?'+index+'='+value;
    // }
   
    const filteredFile = await filterImageFromURL(joinedQquery);
        res.send(filteredFile)
        // const deletFile = await deleteLocalFiles([joinedQquery])
        return;
    // const url = req.baseUrl
    // const filteredImage = filterImageFromURL(imagePath)
    // res.download(imagePath, function(err) {
    //     if(err) {
    //         console.log(err);
    //     }
    // })
    // const fileDir =  `${__dirname}../../../../../../public/photos/${image}`;
    if (!fs.existsSync(image)) {
        res.status(404);
        res.send('file not found');
        return;
    }
    try {
        const filteredFile = await filterImageFromURL(image);
        res.sendFile(filteredFile)
        const deletFile = await deleteLocalFiles([image])
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