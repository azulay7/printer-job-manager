import mongoose from 'mongoose';

var Schema = mongoose.Schema({
  createdAt:{
    type: Date,
    default: Date.now
  },
  jobText: String,
  status : String,
  startTime: Date,
  endTime: Date,
  duration: Number
});

export default mongoose.model('Job', Schema);
