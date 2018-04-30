// ./angular-client/src/app/job/job.service.ts
import { Injectable } from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class JobService {
  private apiUrl = 'http://localhost:3001/api/';
  showAddJobBox:boolean = true;

  constructor(private http: Http){ }

  getJobs(): Promise<any>{
      return this.http.get(this.apiUrl+'getJobs')
                 .toPromise()
                 .then(this.handleData)
                 .catch(this.handleError)
  }

  createJob(job:any,socket:any): void{
    socket.emit('addJob', job);
  }

  /**
   * for cancel and Up/Down Job
   * @param job
   * @param socket
   */
  updateJob(job:any,socket:any):void{
    socket.emit('updateJob', job);
  }

  deleteJob(job:any,socket:any):void{
    socket.emit('deleteJob', job);
  }

  cancelJob(job:any,socket:any):void{
    socket.emit('cancelJob', job);
  }

  jobSwapIndex(index1:number,index2:number): Promise<any>{
    return this.http.post(this.apiUrl+'jobSwapIndex',{index1,index2})
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  private handleData(res: any) {
       let body = res.json();
       console.log(body); // for development purposes only
       return body || {};
   }

 private handleError(error: any): Promise<any> {
     console.error('An error occurred', error); // for development purposes only
     return Promise.reject(error.message || error);
 }

}
