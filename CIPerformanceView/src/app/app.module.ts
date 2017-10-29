import { AppVeyorApiService } from './services/app-veyor-api.service';
import { TravisApiService } from './services/travis-api.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [TravisApiService, AppVeyorApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
