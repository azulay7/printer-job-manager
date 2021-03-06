// ./express-server/controllers/job.server.controller.js
import mongoose from 'mongoose';
import * as _ from 'lodash';

//import models
import Job from '../models/job.server.model';
import printer from '../devices/printer'

const JobStatusEnum={PRINTING:"Printing", QUEUED:"Queued",DONE:"Done",CANCELED:"Canceled"}

var printerCurWorkSubscribtion=null; //used to cancel the job by request

/**
 * wakeup printer after crash (node.js crash)
 * print first printing status job if any, if not pop the queue
 */
export const printerWakeup=(io)=>{
    Job.find({status:JobStatusEnum.PRINTING}).exec((err,jobs) => {
        if(err){
            console.log(JSON.stringify({'success':false,'message':'Some Error',error}));
        }
        if(jobs.length){
            let job=jobs[0];
            printJob(io,job);
        }
        else //there is no printing Job that have been crushed
        {
            popQueue(io);
        }
    })
}

/**
 * pop recursively the queue
 * @param io -socket.io
 */
export const popQueue=(io)=>{
    Job.find({status:JobStatusEnum.PRINTING}).exec((err,jobs) => {
        if(err){
            return res.json({'success':false,'message':'Some Error'});
        }
        if(!jobs.length){ //don't popup if there is printing job

            Job.find({status:JobStatusEnum.QUEUED}).exec((err,jobs) => {
                if(err){
                    return res.json({'success':false,'message':'Some Error'});
                }
                if(jobs.length){
                    let job =jobs[0];
                    printJob(io,job)
                }
            })

        }
    })


}

/**
 * print job and popup queued at the end
 * @param io
 * @param job
 */
const printJob=(io,job)=>{
    job.status=JobStatusEnum.PRINTING;
    job.startTime=new Date();
    Job.findOneAndUpdate({ _id:job.id }, job, { new:true }, (err,job) => {
        if (err) {
            console.log(err);
        }
        else {
            let result = {'success':true,'message':'Job Update Queued to Printing status Successfully',job};
            io.emit('JobUpdated', result);
            printerCurWorkSubscribtion=printer.print(job).subscribe((job)=>{
                job.status = JobStatusEnum.DONE;
                job.endTime = new Date();
                job.duration = Date.now() - job.startTime.getTime();
                Job.findOneAndUpdate({ _id:job.id }, job, { new:true }, (err,job) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        let result = {'success':true,'message':'Job Updated state from Printing to Done Successfully',job};
                        io.emit('JobUpdated', result);
                        popQueue(io);
                    }
                });
            })

        }
    });
}

/**
 * get all jobs
 */
export const getJobs = (req,res) => {
  Job.find().exec((err,jobs) => {
    if(err){
    return res.json({'success':false,'message':'Some Error'});
    }

    return res.json({'success':true,'message':'Jobs fetched successfully',jobs});
  });
}

/**
 * swap between to docs
 * @param req
 * @param res
 */
export const jobSwapIndex = (req,res) => {
    console.log('swap')
    let job1 = req.body.job1;
    let job2 = req.body.job2;

    Job.update({_id:job2._id}, { createdAt: job1.createdAt, name: job1.name,status:job1.status}, (err, job) => {
        if (err) {
            return res.json({'success': false, 'message': 'Some Error'});
        }
        if (job) {
            Job.update({_id:job1._id}, { createdAt: job2.createdAt, name: job2.name,status:job2.status}, (err, job) => {
                if (err) {
                    return res.json({'success': false, 'message': 'Some Error'});
                }
                if(job)
                {
                    Job.find().exec((err, jobs) => {
                        if (err) {
                            return res.json({'success': false, 'message': 'Some Error'});
                        }

                        return res.json({'success': true, 'message': 'Jobs Swap index successfully', jobs});
                    });
                }
            });

        }
    });
};


/**
 * add printer job
 * @param io -socket.io
 * @param T- data model
 */
export const addJob = (io,T) => {
  let result;
  const newJob = new Job(T);
  newJob.status =JobStatusEnum.QUEUED;

  newJob.save((err,job) => {
      if(err){
          result = {'success':false,'message':'Some Error','error':err};
          console.log(result);
      }
      else{
          const result = {'success':true,'message':'Job Added Successfully',job}
          io.emit('JobAdded', result);
          popQueue(io);
      }
  })
}

/**
 * update job
 * I use it the most to change the state and duration
 * @param io -socket.io
 * @param T- data model
 */
export const updateJob = (io,T) => {
  let result;
  Job.findOneAndUpdate({ _id:T.id }, T, { new:true }, (err,job) => {
    if(err){
      result = {'success':false,'message':'Some Error','error':err};
      console.log(result);
    }
    else{
     result = {'success':true,'message':'Job Updated Successfully',job};
     io.emit('JobUpdated', result);
    }
  })
}

/**
 * cancel job
 * @param req
 * @param res
 */
export const cancelJob = (io,T)  => {
    let result;

    if(T.status==JobStatusEnum.PRINTING){
        printer.cancel(printerCurWorkSubscribtion);
        Job.findById(T._id, (err,job) => {
          if(err){
              return res.json({'success':false,'message':'Some Error'});
          }
          else {
              job.status = JobStatusEnum.CANCELED;
              job.save(job,(err,job) => {
                  result = {'success':true,'message':'Cancel Job',job};
                  io.emit('JobUpdated', result);
                  popQueue(io);
              });
          }

        })
    }
    else{
        result= res.json({'success':false,'message':'Job with the given id not found'});
    }


}

/**
 * delete job from the queue
 * check first if job isn't in Printing status
 * @param io -socket.io
 * @param T- data model
 */
export const deleteJob = (io,T) => {
  let result;
  Job.findById(T._id, (err,job) => {
    if(err){
        result = {'success':false,'message':'Some Error','error':err};
        console.log(result);
    }
    else if(job.status==JobStatusEnum.PRINTING){
        result = {'success':false,'message':'Cannot delete printing job'};
        console.log(result);
    }
    else {
      Job.findByIdAndRemove(T._id,(err,job)=>{
          if(err){
              result = {'success':false,'message':'Some Error','error':err};
              console.log(result);
          }
          else {
              result = {'success': true, 'message': 'Job deleted successfully', job};
              io.emit('JobDeleted', result);
          }
      } )

    }
  })
}

