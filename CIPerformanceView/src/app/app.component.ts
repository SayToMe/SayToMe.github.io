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
  logs: any[];
  jobs: IJob[];
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

interface IJob {
  id: number;
  repository_id: number;
  repository_slug: string;
  stage_id?: number;
  build_id: number;
  commit_id: number;
  number: string;
  config: {
    language: string;
    sudo: boolean,
    before_install: string[];
    script: string[];
    result: string;
    group: string;
    dist: string;
    os: string
  };
  state: string;
  started_at: string;
  finished_at: string;
  queue: string;
  allow_failure: boolean;
  tags?: string;
  annotation_ids: number[];

  log: string;
  parsed;
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

    return this.httpClient.get('https://api.travis-ci.org/users', {
      headers: headers
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

    this.httpClient.get('https://api.travis-ci.org/repos/SayToMe/Solve/builds', {
      headers: headers
    })
      .toPromise()
      .then((res: { builds: IBuild[], commits: ICommit[] }) => {
        this.builds = res.builds;
        this.builds.forEach(build => {
          build.commit = res.commits.find(c => c.id === build.commit_id);
        });

        this.builds.forEach(build => {
          build.jobs = [];

          build.job_ids.forEach((jobId) => {
            return this.httpClient.get('https://api.travis-ci.org/jobs/' + jobId, {
              headers: headers
            })
            .toPromise()
            .then((r: { job: IJob, commit: ICommit }) => {
              build.jobs.push(r.job);

              return this.httpClient.get('https://api.travis-ci.org/jobs/' + r.job.id + '/log', { responseType: 'text' })
              .toPromise()
              .then((log: string) => {
                  r.job.log = log;
                  r.job.parsed = this.parseLog(log);
              });
            });
          });
        });

        return res.builds;
      });
  }

  private parseLog(log: string) {
    const lines = log.split(/[\r\n]/);

    const r = /Execution Runtime: /;
    const r2 = /Tests run: (\d+), Errors: (\d+), Failures: (\d+), Inconclusive: (\d+), Time: (.+?) seconds/;
    const testCheck = /\*\*\*\*\*/;

    const startTestLineIdx = lines.findIndex(l => r.test(l));
    const endTestLineIdx = lines.findIndex(l => r2.test(l));

    const tests = lines.slice(startTestLineIdx, endTestLineIdx).filter(l => testCheck.test(l)).map(l => l.match(/\.(.+?)$/)[1]);
    const [_, testsNum, errors, failures, inconclusive, time] = lines[endTestLineIdx].match(r2);

    return {
      testsNum: testsNum,
      errors: errors,
      failures: failures,
      inconclusive: inconclusive,
      time: time
    };
  }

  private getHeaders() {
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.travis-ci.2+json',
      'Authorization': 'token "uJeDK6yjk6Gt9HtfRNec-w"'
    });

    return headers;
  }
}
