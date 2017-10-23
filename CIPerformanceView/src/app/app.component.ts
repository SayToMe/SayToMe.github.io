import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import 'rxjs/operators/map';

import * as ChartJS from 'chart.js';
import * as _ from 'lodash';

import { JenkinsDefinitions } from './definitions/jenkins-definitions';
import { AppVeyorDefinitons } from './definitions/app-veyor-definitions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: JenkinsDefinitions.IUser;
  builds: JenkinsDefinitions.IBuild[];
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
    const headers = this.getJenkinsHeaders();

    return this.httpClient.get('https://api.travis-ci.org/users', {
      headers: headers
    })
      .toPromise()
      .then((res: { user: JenkinsDefinitions.IUser }) => {
        this.user = res.user;

        return res.user;
      });
  }

  private getBuilds() {
    const headers = this.getJenkinsHeaders();
    const params = new HttpParams();

    return this.httpClient.get('https://api.travis-ci.org/repos/SayToMe/Solve/builds', {
      headers: headers
    })
      .toPromise()
      .then((res: { builds: JenkinsDefinitions.IBuild[], commits: JenkinsDefinitions.ICommit[] }) => {
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
              .then((r: { job: JenkinsDefinitions.IJob, commit: JenkinsDefinitions.ICommit }) => {
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

  private getJenkinsHeaders() {
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.travis-ci.2+json',
      'Authorization': 'token "uJeDK6yjk6Gt9HtfRNec-w"'
    });

    return headers;
  }

  private getAppVeyorHeaders() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer 7t97fs85nh82dj3fd71a'
    });

    return headers;
  }
}
