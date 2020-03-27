import { TravisApiService } from './services/travis-api.service';
import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import 'rxjs/operators/map';

import * as ChartJS from 'chart.js';
import * as _ from 'lodash';

import { TravisDefinitions } from './definitions/travis-definitions';
import { AppVeyorDefinitons } from './definitions/app-veyor-definitions';
import * as Common from './definitions/common';

import {randomColorGenerator, prettify} from './utils/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: Common.IUser;
  builds: Common.IBuild[];
  branchLastResult: any[];

  constructor(private httpClient: HttpClient, private travisApi: TravisApiService) {
    this.travisApi.auth().then((user) => {
      this.user = TravisDefinitions.toCommonUser(user);
    });

    this.travisApi.getBuilds().then((builds) => {
      this.builds = builds.map(build => TravisDefinitions.toCommonBuild(build));

      this.prepareChart(this.builds);
      this.branchLastResult = this.prepareLastBuilds(this.builds);
    });
  }

  private prepareChart(builds: Common.IBuild[]) {
    const dt = _.flatMap(builds, b => b.jobs.filter(j => !_.isNil(j.info)).map(j => {
      return {
        label: b.commit.branch + '(' + b.number + ')',
        message: b.commit.message,
        time: j.info.time.toMilliseconds(),
        referenceTime: j.info.referenceTime && j.info.referenceTime.toMilliseconds()
      };
    }))
    .filter(job => !_.isNil(job.referenceTime));

    const labels = dt.map(j => j.label);
    const data = dt.map(j => j.time / j.referenceTime);
    const colors = dt.map(j => randomColorGenerator());

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

  private prepareLastBuilds(builds: Common.IBuild[]) {
    const allBuilds = _.flatMap(builds, b => b.jobs.filter(j => !_.isNil(j.info)).map(j => {
      return {
        id: b.number,
        branch: b.commit.branch,
        fullTime: j.info.time,
        referenceTime: j.info.referenceTime,
        time: j.info.referenceTime && Common.Time.fromMilliSeconds(j.info.referenceTime.toMilliseconds() / j.info.time.toMilliseconds())
      };
    }));

    const lastBuilds = _.map(_.groupBy(allBuilds, b => b.branch), bs => _.maxBy(bs, b => b.id));

    return lastBuilds;
  }
}
