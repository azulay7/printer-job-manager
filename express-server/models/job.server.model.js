import mongoose from 'mongoose';

var Schema = mongoose.Schema({
  createdAt:{
    type: Date,
    default: Date.now
  },
  jobText: String,
  status : String
});

export default mongoose.model('Job', Schema);
