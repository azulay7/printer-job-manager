// ./angular-client/src/app/app.component.ts
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { JobService } from './job/job.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(private jobService:JobService) { }

 // class method for toggling  AddJobBox in job-list.component.html
  showAddJobBox(e):void{
    e.preventDefault();
    this.jobService.showAddJobBox = !this.jobService.showAddJobBox;
  }

}
