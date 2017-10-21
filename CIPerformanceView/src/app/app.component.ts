import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import 'rxjs/operators/map';

import Chart from 'chart.js';

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

    const r = /Execution Runtime: /;
    const r2 = /Tests run: (\d+), Errors: (\d+), Failures: (\d+), Inconclusive: (\d+), Time: (.+?) seconds/;
    const testCheck = /\*\*\*\*\*/;
    const r3 = /\*\*\*\*\* Test (.+)\. Took (\d*\.?\d*) ms. GC collects: (-?\d+) (-?\d+) (-?\d+) Allocated: (\d*\.?\d*) KB\./;

    const startTestLineIdx = lines.findIndex(l => r.test(l));
    const endTestLineIdx = lines.findIndex(l => r2.test(l));

    const tests = lines.slice(startTestLineIdx, endTestLineIdx).filter(l => r3.test(l)).map(l => l.match(r3)).map(rs => {
      return {
        shortName: rs[1].slice(rs[1].lastIndexOf('.') + 1),
        fullName: rs[1],
        duration: rs[2],
        collect0: rs[3],
        collect1: rs[4],
        collect2: rs[5],
        allocated: rs[6]
      };
    });

    const [_, testsNum, errors, failures, inconclusive, time] = lines[endTestLineIdx].match(r2);

    return {
      testsNum: testsNum,
      errors: errors,
      failures: failures,
      inconclusive: inconclusive,
      time: time,
      tests: tests
    };
  }

  private prepareChart() {
    const dt = this.builds.map(b => b.jobs.map(j => {
      return {
        message: b.commit.message,
        time: j.parsed.time
      };
    })).map(jobs => jobs[0]);

    const labels = dt.map(j => j.message);
    const data = dt.map(j => j.time);
    const colors = dt.map(j => this.randomColorGenerator());

    const ctx = (document.getElementById('performanceChart') as HTMLCanvasElement).getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels, // ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: 'Tests execution time',
          data: data, // [12, 19, 3, 5, 2, 3],
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
    let c;

    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        // tslint:disable-next-line:no-bitwise
        const r = (c >> 16) & 255;
        // tslint:disable-next-line:no-bitwise
        const g = (c >> 8) & 255;
        // tslint:disable-next-line:no-bitwise
        const b = c & 255;

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
