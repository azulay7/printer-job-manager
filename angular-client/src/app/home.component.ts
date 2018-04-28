// ./angular-client/src/app/home.component.ts
import { Component, OnInit } from '@angular/core';

import { JobService } from './job/job.service';

@Component({
  selector: 'my-home',
  templateUrl: './home.component.html',
  styleUrls:[ './home.component.css' ]
})
export class HomePageComponent implements OnInit {
  jobs:any[] = [];
  constructor(private jobService: JobService) { }

  ngOnInit(): void {
     this.jobService.getJobs()
                     .then(jobs => this.jobs = jobs.jobs.reverse().slice(0,3))
  }

}
