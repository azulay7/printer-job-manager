// ./express-server/controllers/job.server.controller.js
import mongoose from 'mongoose';


//import models
import Job from '../models/job.server.model';

export const getJobs = (req,res) => {
  Job.find().exec((err,jobs) => {
    if(err){
    return res.json({'success':false,'message':'Some Error'});
    }

    return res.json({'success':true,'message':'Jobs fetched successfully',jobs});
  });
}

export const addJob = (io,T) => {
  let result;
  const newJob = new Job(T);
  newJob.save((err,job) => {
    if(err){
      result = {'success':false,'message':'Some Error','error':err};
      console.log(result);
    }
    else{
      const result = {'success':true,'message':'Job Added Successfully',job}
       io.emit('JobAdded', result);
    }
  })
}

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
