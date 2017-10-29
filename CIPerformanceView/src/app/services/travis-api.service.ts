import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TravisDefinitions } from '../definitions/travis-definitions';
import * as _ from 'lodash';

@Injectable()
export class TravisApiService {

  constructor(private httpClient: HttpClient) { }

  auth() {
    const headers = this.getJenkinsHeaders();

    return this.httpClient.get('https://api.travis-ci.org/users', {
      headers: headers
    })
      .toPromise()
      .then((res: { user: TravisDefinitions.IUser }) => {
        return res.user;
      });
  }

  getBuilds() {
    const headers = this.getJenkinsHeaders();
    const params = new HttpParams();

    return this.httpClient.get('https://api.travis-ci.org/repos/SayToMe/Solve/builds', {
      headers: headers
    })
      .toPromise()
      .then((res: { builds: TravisDefinitions.IBuild[], commits: TravisDefinitions.ICommit[] }) => {
        const builds = res.builds;
        builds.forEach(build => {
          build.commit = res.commits.find(c => c.id === build.commit_id);
        });

        return Promise.all(builds.map(build => {
          return Promise.all(build.job_ids.map((jobId) => {
            return this.httpClient.get('https://api.travis-ci.org/jobs/' + jobId, {
              headers: headers
            })
              .toPromise()
              .then((r: { job: TravisDefinitions.IJob, commit: TravisDefinitions.ICommit }) => {
                return this.httpClient.get('https://api.travis-ci.org/jobs/' + r.job.id + '/log', { responseType: 'text' })
                  .toPromise()
                  .then((log: string) => {
                    r.job.log = log;
                    return r.job;
                  });
              });
          })).then((jobs: TravisDefinitions.IJob[]) => {
            build.jobs = jobs;
            return build;
          });
        }));
      });
  }


  private getJenkinsHeaders() {
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.travis-ci.2+json',
      'Authorization': 'token "uJeDK6yjk6Gt9HtfRNec-w"'
    });

    return headers;
  }
}
