// ./angular-client/src/app/app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule }    from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { JobService } from './job/job.service';
import { JobListComponent } from './job/job-list/job-list.component';
import { Mili2secPipe } from './pipes/mili2sec.pipe';

@NgModule({
  declarations: [
    AppComponent,
    JobListComponent,
    Mili2secPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  providers: [ JobService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
