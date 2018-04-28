// ./express-server/controllers/job.server.controller.js
import mongoose from 'mongoose';


//import models
import Job from '../models/job.server.model';
import printer from './printer.server.controller'

const JobStatusEnum={PRINTING:"printing", QUEUED:"queued"}

/**
 * wakeup printer after crash (node.js crash)
 * get first printing status job and the pop recursively the queue
 */
export const printerWakeup=(io)=>{
    Job.find({status:JobStatusEnum.PRINTING}).exec((err,jobs) => {
        if(err){
            return res.json({'success':false,'message':'Some Error'});
        }
        if(jobs.length){
            let job=jobs[0];
            updateJob(io,job);
            printer.print(job).then((jobDone)=>{
                jobDone.status="Done";
                updateJob(io,jobDone);

                popQueue(io);
            })
        }
        else
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
    Job.find({status:JobStatusEnum.QUEUED}).exec((err,jobs) => {
        if(err){
            return res.json({'success':false,'message':'Some Error'});
        }
        if(jobs.length){
            let job =jobs[0];
            job.status=JobStatusEnum.PRINTING;
            updateJob(io,job);
            printer.print(job).then((job)=>{
                job.status="Done";
                updateJob(io,job);
                popQueue(io);
            })

        }
    })
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
 * add printer job
 * @param T -data model
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
 * add job to the queue
 * @param req
 * @param res
 */
export const getJob = (req,res) => {
  Job.find({_id:req.params.id}).exec((err,job) => {
    if(err){
    return res.json({'success':false,'message':'Some Error'});
    }
    if(job.length){
      return res.json({'success':true,'message':'Job fetched by id successfully',job});
    }
    else{
      return res.json({'success':false,'message':'Job with the given id not found'});
    }
  })
}

/**
 * delete job from the queue
 * @param io -socket.io
 * @param T- data model
 */
export const deleteJob = (io,T) => {
  let result;
  Job.findByIdAndRemove(T._id, (err,job) => {
    if(err){
    result = {'success':false,'message':'Some Error','error':err};
    console.log(result);
    }
    else {
      result = {'success':true,'message':'Job deleted successfully', job};
      io.emit('JobDeleted', result);
    }
  })
}

