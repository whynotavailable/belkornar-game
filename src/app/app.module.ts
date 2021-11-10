import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { AreaComponent } from './area/area.component';
import { ActivityComponent } from './activity/activity.component';
import { ProgressbarModule } from "ngx-bootstrap/progressbar";

@NgModule({
  declarations: [
    AppComponent,
    AreaComponent,
    ActivityComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ProgressbarModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
