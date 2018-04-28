// ./angular-client/src/app/job/job.service.ts
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class JobService {
  private apiUrl = 'http://localhost:3001/api/';
  showAddJobBox:boolean = true;

  constructor(private http: Http){ }

  getJobs(): Promise<any>{
      return this.http.get(this.apiUrl)
                 .toPromise()
                 .then(this.handleData)
                 .catch(this.handleError)
  }

  getJob(id:string): Promise<any>{
    return this.http.get(this.apiUrl + id)
                    .toPromise()
                    .then(this.handleData)
                    .catch(this.handleError)
  }

  createJob(job:any,socket:any): void{
    socket.emit('addJob', job);
  }

  updateJob(job:any,socket:any):void{
    socket.emit('updateJob', job);
  }

  deleteJob(job:any,socket:any):void{
    socket.emit('deleteJob', job);
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