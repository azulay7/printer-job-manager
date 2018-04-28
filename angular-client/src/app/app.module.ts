// ./angular-client/src/app/app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule }    from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home.component';

import { AppRoutingModule } from './app-routing.module';
import { JobService } from './job/job.service';
import { JobListComponent } from './job/job-list/job-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    JobListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule
  ],
  providers: [ JobService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
