// ./angular-client/src/app/app.component.ts
import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { JobService } from './job/job.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {

  constructor() { }

}
