import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import 'rxjs/operators/map';

interface IUser {
  id: number;
  name: string;
  login: string;
  email: string;
  gravatar_id: string;
  avatar_url: string;
  locale: string;
  is_syncing: boolean;
  synced_at: string;
  correct_scopes: boolean;
  created_at: string;
  channels: string[];
}

interface IBuild {
  commit_id: number;
  config: Object;
  duration: number;
  finished_at: string;
  id: number;
  job_ids: number[];
  number: string;
  pull_request: boolean;
  pull_request_number: string;
  pull_request_title: string;
  repository_id: number;
  started_at: string;
  state: string;

  commit: ICommit;
}

interface ICommit {
  author_email: string;
  author_name: string;
  branch: string;
  committed_at: string;
  committer_email: string;
  committer_name: string;
  compare_url: string;
  id: number;
  message: string;
  pull_request_number?: number;
  sha: string;
  tag?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: IUser;
  builds: IBuild[];

  constructor(private httpClient: HttpClient) {
    this.auth();
    this.getBuilds();
  }

  private auth() {
    const headers = this.getHeaders();
    const params = new HttpParams();

    return this.httpClient.get('https://api.travis-ci.org/users', {
      headers: headers, params: params
    })
      .toPromise()
      .then((res: { user: IUser }) => {
        this.user = res.user;

        return res.user;
      });
  }

  private getBuilds() {
    const headers = this.getHeaders();
    const params = new HttpParams();

    return this.httpClient.get('https://api.travis-ci.org/repos/SayToMe/Solve/builds', {
      headers: headers, params: params
    })
      .toPromise()
      .then((res: { builds: IBuild[], commits: ICommit[] }) => {
        this.builds = res.builds;
        this.builds.forEach(build => {
          build.commit = res.commits.find(c => c.id === build.commit_id);
        });

        return res.builds;
      });
  }

  private getHeaders() {
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.travis-ci.2+json',
      'User-Agent': 'MyClient/1.0.0',
      'Authorization': 'token "uJeDK6yjk6Gt9HtfRNec-w"'
    });

    return headers;
  }
}
