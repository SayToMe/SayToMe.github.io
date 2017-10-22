import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import 'rxjs/operators/map';

import * as ChartJS from 'chart.js';
import * as _ from 'lodash';

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
  parsed: {
    testsNum: string;
    errors: string;
    failures: string;
    inconclusive: string;
    time: string;
    referenceTime: string;
    tests: {
      shortName: string;
      fullName: string;
      duration: string;
      collect0: string;
      collect1: string;
      collect2: string;
      allocated: string;
    }[];
  };
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
    this.getBuilds().then(() => {
      this.prepareChart();
    });
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

    return this.httpClient.get('https://api.travis-ci.org/repos/SayToMe/Solve/builds', {
      headers: headers
    })
      .toPromise()
      .then((res: { builds: IBuild[], commits: ICommit[] }) => {
        this.builds = res.builds;
        this.builds.forEach(build => {
          build.commit = res.commits.find(c => c.id === build.commit_id);
        });

        return Promise.all(this.builds.map(build => {
          build.jobs = [];

          return Promise.all(build.job_ids.map((jobId) => {
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
          }));
        }));
      });
  }

  private parseLog(log: string) {
    const lines = log.split(/[\r\n]/);

    const executionRuntimeRegexp = /Execution Runtime: /;
    const fullTestInfoRegexp = /Tests run: (\d+), Errors: (\d+), Failures: (\d+), Inconclusive: (\d+), Time: (.+?) seconds/;
    const testInfoRegexp = /\*\*\*\*\* Test (.+)\. Took (\d*\.?\d*) ms. GC collects: (-?\d+) (-?\d+) (-?\d+) Allocated: (\d*\.?\d*) KB\./;

    const startTestLineIdx = lines.findIndex(l => executionRuntimeRegexp.test(l));
    const endTestLineIdx = lines.findIndex(l => fullTestInfoRegexp.test(l));

    const tests = lines.slice(startTestLineIdx, endTestLineIdx)
    .filter(l => testInfoRegexp.test(l))
    .map(l => l.match(testInfoRegexp))
    .map(([str, name, duration, gc0, gc1, gc2, allocated]) => ({
        shortName: name.slice(name.lastIndexOf('.') + 1),
        fullName: name,
        duration: duration,
        collect0: gc0,
        collect1: gc1,
        collect2: gc2,
        allocated: allocated
      }));

    const [fullString, testsNum, errors, failures, inconclusive, time] = lines[endTestLineIdx].match(fullTestInfoRegexp);
    const referenceTest = tests.find(t => t.shortName === 'reference test');
    const referenceTime = referenceTest && referenceTest.duration;

    return {
      testsNum: testsNum,
      errors: errors,
      failures: failures,
      inconclusive: inconclusive,
      time: time,
      referenceTime: referenceTime,
      tests: tests
    };
  }

  private prepareChart() {
    const dt = this.builds.map(b => b.jobs.map(j => {
      return {
        message: b.commit.message,
        time: j.parsed.time,
        referenceTime: j.parsed.referenceTime
      };
    }))
    .map(jobs => _.first(jobs))
    .filter(job => !_.isEmpty(job.referenceTime));

    const labels = dt.map(j => j.message);
    const data = dt.map(j => (+j.time) / (+j.referenceTime));
    const colors = dt.map(j => this.randomColorGenerator());

    const ctx = (document.getElementById('performanceChart') as HTMLCanvasElement).getContext('2d');
    const chart = new ChartJS.Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Tests execution time (time/reference)',
          data: data,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  private randomColorGenerator = (opacity = 0.5) => {
    const hex = '#' + (Math.random().toString(16) + '0000000').slice(2, 8);
    return this.hexToRgbA(hex, opacity);
  }

  private hexToRgbA = (hex: string, opacity: number) => {
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        let c = hex.substring(1).split('');

        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }

        const res = '0x' + c.join('');
        const r = c[0] + c[1];
        const g = c[2] + c[3];
        const b = c[4] + c[5];

        return 'rgba(' + [r, g, b].join(',') + ',' + opacity + ')';
    }

    throw new Error('Bad Hex');
}

  private getHeaders() {
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.travis-ci.2+json',
      'Authorization': 'token "uJeDK6yjk6Gt9HtfRNec-w"'
    });

    return headers;
  }
}
