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
      referencedDuration: string;
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
  branchLastResult: any[];

  constructor(private httpClient: HttpClient) {
    this.auth();
    this.getBuilds().then(() => {
      this.prepareChart();
    });
    this.getBuilds().then(() => {
      this.prepareLastBuilds();
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

    const tests = lines
      .slice(startTestLineIdx, endTestLineIdx)
      .filter(l => testInfoRegexp.test(l))
      .map(l => l.match(testInfoRegexp))
      .map(([str, name, duration, gc0, gc1, gc2, allocated]) => ({
          shortName: name.slice(name.lastIndexOf('.') + 1),
          fullName: name,
          duration: duration,
          referencedDuration: null,
          collect0: gc0,
          collect1: gc1,
          collect2: gc2,
          allocated: allocated
        }));

    const [fullString, testsNum, errors, failures, inconclusive, time] = lines[endTestLineIdx].match(fullTestInfoRegexp);
    const referenceTest = tests.find(t => t.shortName === 'reference test');
    const referenceTime = referenceTest && referenceTest.duration;

    if (!_.isEmpty(referenceTime)) {
      tests.forEach(t => {
        t.referencedDuration = this.prettify((+t.duration) / (+referenceTime));
      });
    }

    tests.forEach(t => {
      t.duration = this.prettify(t.duration);
    });

    return {
      testsNum: testsNum,
      errors: errors,
      failures: failures,
      inconclusive: inconclusive,
      time: this.prettify(+time * 100),
      referenceTime: this.prettify(referenceTime),
      tests: tests
    };
  }

  private prepareChart() {
    const dt = _.flatMap(this.builds, b => b.jobs.filter(j => !_.isNil(j.parsed)).map(j => {
      return {
        label: b.commit.branch + '(' + b.number + ')',
        message: b.commit.message,
        time: j.parsed.time,
        referenceTime: j.parsed.referenceTime
      };
    }))
    .filter(job => !_.isEmpty(job.referenceTime));

    const labels = dt.map(j => j.label);
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
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            label: (s) => dt[s.index].message
          }
        }
      }
    });
  }

  private prepareLastBuilds() {
    const allBuilds = _.flatMap(this.builds, b => b.jobs.filter(j => !_.isNil(j.parsed)).map(j => {
      return {
        id: b.number,
        branch: b.commit.branch,
        fullTime: j.parsed.time,
        referenceTime: j.parsed.referenceTime,
        time: j.parsed.referenceTime && this.prettify((+j.parsed.referenceTime) / (+j.parsed.time))
      };
    }));

    const lastBuilds = _.map(_.groupBy(allBuilds, b => b.branch), bs => _.maxBy(bs, b => b.id));

    this.branchLastResult = lastBuilds;
  }

  private randomColorGenerator = (opacity = 0.5) => {
    const r = Math.random() * 256;
    const g = Math.random() * 256;
    const b = Math.random() * 256;
    return 'rgba(' + [r.toFixed(), g.toFixed(), b.toFixed(), opacity].join(',') + ')';
  }

  private prettify(val: string | number, digitsAfterDot = 2) {
    if (_.isNil(val)) {
      return val;
    } else if (_.isNumber(val)) {
      return val.toFixed(digitsAfterDot);
    } else {
      const dotIndex = val.indexOf('.');
      return dotIndex === -1
        ? val
        : val.slice(0, dotIndex + 3);
    }
  }

  private getHeaders() {
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.travis-ci.2+json',
      'Authorization': 'token "uJeDK6yjk6Gt9HtfRNec-w"'
    });

    return headers;
  }
}
