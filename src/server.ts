import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { IndexRouter } from './controllers/v0/index.router';

var cors = require('cors');

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  // Cross Origin Request access
  app.use(cors());
  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  app.use('/api/v0/', IndexRouter);

  app.use(express.static('public'));
  // Root URI call
  app.get( "/", async ( req, res ) => {
    res.send(`Welcome <br/> Checkout How this workd by clicking the to links below. <br/> <a href="https://stormcelltech.com/assets/images/background/stormcell-hero-bg.png" target="_blank">orginal Image</a> <br /> <a href=http://${req.get('host')}/api/v0/photos/filteredimage?image_url=https://stormcelltech.com/assets/images/background/stormcell-hero-bg.png target="_blank">Filtered Image</a>`)
    
    res.end();
  } );

  // GET /filteredimage?image_url={{URL}}
    // Ans: this is found in /api/v0/photos/filteredimage

  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  // app.get( "/", async ( req, res ) => {
  //   res.send("try GET /filteredimage?image_url={{}}")
  // } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();