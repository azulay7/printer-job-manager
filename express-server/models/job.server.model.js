import mongoose from 'mongoose';

var Schema = mongoose.Schema({
  createdAt:{
    type: Date,
    default: Date.now
  },
  jobText: String
});

export default mongoose.model('Job', Schema);
