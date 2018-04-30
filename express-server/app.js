// ./express-server/app.js
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import SourceMapSupport from 'source-map-support';
import bb from 'express-busboy';
import http from 'http';
import socket from 'socket.io';

// import routes
import jobRoutes from './routes/job.server.route';

//import controller file
import * as jobController from './controllers/job.server.controller';

// define our app using express
const app = express();

const server = http.Server(app);
const io = socket(server);


// socket.io connection
io.on('connection', (socket) => {
  console.log("Connected to Socket!!"+ socket.id);

  // Receiving Jobs from client
  socket.on('addJob', (Job) => {
    console.log('socketData: '+JSON.stringify(Job));
    jobController.addJob(io,Job);
  });

  // Receiving Updated Job from client
  socket.on('updateJob', (Job) => {
    console.log('socketData: '+JSON.stringify(Job));
    jobController.updateJob(io,Job);
  });

  // Receiving Job to Delete
  socket.on('deleteJob', (Job) => {
    console.log('socketData: '+JSON.stringify(Job));
    jobController.deleteJob(io,Job);
  });

  // Receiving Job to Cancel
  socket.on('cancelJob', (Job) => {
      console.log('socketData: '+JSON.stringify(Job));
      jobController.cancelJob(io,Job);
  });
})

//printer bootstrap
jobController.printerWakeup(io);

// allow-cors
app.use(function(req,res,next){
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type,Content-Type,Accept, Authorization, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    // allow preflight
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
})

// configure app
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static(path.join(__dirname, 'public')));

// express-busboy to parse multipart/form-data
bb.extend(app);

// set the port
const port = process.env.PORT || 3001;

// connect to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/mern-job-app', {
  useMongoClient: true,
});

// add Source Map Support
SourceMapSupport.install();

app.use('/api', jobRoutes);

app.get('/', (req,res) => {
  return res.end('Api working');
});

// catch 404
app.use((req, res, next) => {
  res.status(404).send('<h2 align=center>Page Not Found!</h2>');
});


// start the server
server.listen(port,() => {
  console.log(`App Server Listening at ${port}`);
});
