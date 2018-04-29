// ./express-server/routes/job.server.route.js
import express from 'express';

//import controller file
import * as jobController from '../controllers/job.server.controller';

// get an instance of express router
const router = express.Router();

router.route('/')
     .get(jobController.getJobs);

router.route('/jobSwapIndex')
    .post(jobController.jobSwapIndex);

router.route('/:id')
      .get(jobController.getJob);


export default router;
