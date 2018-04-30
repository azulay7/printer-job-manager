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
  jobs: any[] = [];
  job: any = {};
  errorMsg=null;

  private url = 'http://localhost:3001';
  private socket;

  constructor(private jobService:JobService) { }

  ngOnInit(): void {
    this.jobService.showAddJobBox = true;
    this.jobService.getJobs()
                    .then(td => this.jobs = td.jobs )
                    .catch(msg=>this.errorMsg=msg);
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
        this.jobs = updatedJobs;
    });
    //Receive Deleted Job and remove it from liste
    this.socket.on('JobDeleted', (data) => {
      console.log('JobDeleted: '+JSON.stringify(data));
      const filteredJobs = this.jobs.filter(t => t._id !== data.job._id);
      this.jobs = filteredJobs;
    });
  }

  /**
   * add job to list
   * @param job
   * @constructor
   */
  AddJob(job:any):void{
    if(!job){ return; }
    this.jobService.createJob(job,this.socket);
  }

  /**
   * disable up button
   * if there is no queued job above id
   */
  JobUpDisabled(job,index)
  {
    let queuedJob=this.jobs.filter(job=>job.status=="Queued");
    return (queuedJob.length < 2 || job.status!='Queued' || index==0 || (index >0 && this.jobs[index-1].status!="Queued"))

  }

  /**
   * disable down key
   * if there is no queued job down
   */
  JobDownDisabled(job,index)
  {
    let queuedJob=this.jobs.filter(job=>job.status=="Queued");
    return (queuedJob.length < 2 || job.status!='Queued' || index==this.jobs.length-1 )
  }

  /**
   * up job in queue
   */
  JobUp(index:number):void{
    this.jobService.jobSwapIndex(this.jobs[index],this.jobs[index-1]).
     then(
       td=>this.jobs=td.jobs
    );
  }

  /**
   * down job in queue
   */
  JobDown(index:number):void{
    this.jobService.jobSwapIndex(this.jobs[index],this.jobs[index+1]).
    then(
      td=>this.jobs=td.jobs
    );
  }

  /**
   * delete job in state!=printing
   */
  DeleteJob(job:any):void{
   if(!job){ return; }
   this.jobService.deleteJob(job,this.socket);
  }

  /**
   * cancel printing job
   */
  CancelJob(job:any):void{
    if(!job){ return; }
    this.jobService.cancelJob(job,this.socket);
  }

}
