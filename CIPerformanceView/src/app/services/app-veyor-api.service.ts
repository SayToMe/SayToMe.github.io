import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AppVeyorApiService {

  constructor() { }

  private getAppVeyorHeaders() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer 7t97fs85nh82dj3fd71a'
    });

    return headers;
  }
}
