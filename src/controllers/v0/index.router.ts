import { Router, Request, Response } from 'express';
import { PhotoRouter } from './photos/routes/photo.router';
// import { UserRouter } from './users/routes/user.router';

const router: Router = Router();

router.use('/photos', PhotoRouter);
// router.use('/users', UserRouter);

router.get('/', async (req: Request, res: Response) => {    
    res.send("Hello World");
});

export const IndexRouter: Router = router;