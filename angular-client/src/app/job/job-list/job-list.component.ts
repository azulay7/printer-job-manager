// ./angular-client/src/app/job/job-list/job-list.component.ts
import { Component, OnInit } from '@angular/core';

import { JobService } from '../job.service';

// import io from "socket.io-client";


@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {
  jobs:any[] = [];
  job:any = {};
  jobToEdit:any = {};
  jobToDelete:any = {};
  fetchingData:boolean = false;
  apiMessage:string;

  private url = 'http://localhost:3001';
  private socket;

  constructor(private jobService:JobService) { }

  ngOnInit(): void {
    this.jobService.showAddJobBox = true;
    this.jobService.getJobs()
                    .then(td => this.jobs = td.jobs );
    this.socket = io.connect(this.url);
    // Receive Added Job
    this.socket.on('JobAdded', (data) => {
      console.log('JobAdded: '+JSON.stringify(data));
      this.jobs.push(data.job);
    });
    //Receive Updated Job
    this.socket.on('JobUpdated', (data) => {
      console.log('JobUpdated: '+JSON.stringify(data));
      const updatedJobs = this.jobs.map(t => {
          if(data.job._id !== t._id){
            return t;
          }
          return { ...t, ...data.job };
        })
        this.apiMessage = data.message;
        this.jobs = updatedJobs;
    });
    //Receive Deleted Job and remove it from liste
    this.socket.on('JobDeleted', (data) => {
      console.log('JobDeleted: '+JSON.stringify(data));
      const filteredJobs = this.jobs.filter(t => t._id !== data.job._id);
      this.apiMessage = data.message;
      this.jobs = filteredJobs;
    });
  }

  AddJob(job:any):void{
    if(!job){ return; }
    this.jobService.createJob(job,this.socket);
  }

  showEditJob(job:any):void{
    this.jobToEdit = job;
    this.apiMessage = "";
  }

  EditJob(job:any):void{
    if(!job){ return; }
    job.id = this.jobToEdit._id;
    this.jobService.updateJob(job,this.socket);
  }

 showDeleteJob(job:any):void{
   this.jobToDelete = job;
   this.apiMessage = "";
 }

 DeleteJob(job:any):void{
   if(!job){ return; }
   this.jobService.deleteJob(job,this.socket);
 }

}
