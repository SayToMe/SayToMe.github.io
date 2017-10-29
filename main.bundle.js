webpackJsonp(["main"],{

/***/ "../../../../../src/$$_gendir lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "../../../../../src/$$_gendir lazy recursive";

/***/ }),

/***/ "../../../../../src/app/app.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<span class=\"pull-right\" *ngIf=\"user\">Logged as {{user.name || 'Unknown'}}</span>\n<span class=\"pull-right\" *ngIf=\"!user\">Authorizing</span>\n\n<!-- <a href=\"https://api.travis-ci.com/auth/handshake\">log in</a> -->\n\n<div class=\"charts\" style=\"margin-left: 50px; margin-right: 50px; height: 500px;\">\n  <canvas id=\"performanceChart\" class=\"performance-chart\"></canvas>\n</div>\n\n<h3>Last builds</h3>\n<span *ngIf=\"!branchLastResult || branchLastResult.length === 0\">\n  Loading builds\n</span>\n<table *ngIf=\"branchLastResult && branchLastResult.length > 0\">\n  <thead>\n    <th>Branch</th>\n    <th>Time</th>\n  </thead>\n  <tbody>\n    <tr *ngFor=\"let build of branchLastResult\">\n      <td>{{build.branch}}</td>\n      <td>{{build.time}}</td>\n    </tr>\n  </tbody>\n</table>\n\n<h3>Builds</h3>\n<table *ngIf=\"builds && builds.length > 0\">\n  <thead>\n    <th>Number</th>\n    <th>Finished</th>\n    <th>State</th>\n    <th>Message</th>\n    <th>Misc</th>\n  </thead>\n  <tbody>\n    <tr *ngFor=\"let build of builds\">\n      <td>\n         {{build.number}}\n      </td>\n      <td>\n         {{build.finished}}\n      </td>\n      <td>\n          {{build.state}}\n      </td>\n      <td>\n          {{build.commit.message}}\n      </td>\n      <td>\n        <span *ngIf=\"!build.jobs || build.jobs.length === 0\">\n          Loading jobs and logs\n        </span>\n        <ul *ngIf=\"build.jobs && build.jobs.length > 0\">\n          <ng-container *ngFor=\"let job of build.jobs\">\n              <li *ngIf=\"job.info\">\n                  Run: {{job.info.testsCount}}. Failures: {{job.info.failuresCount}}. Total time: {{job.info.time}}.\n                  <table *ngIf=\"job.info.tests && job.info.tests.length > 0\">\n                    <thead>\n                      <th>Name</th>\n                      <th>Duration (ms)</th>\n                      <th>Referenced duration</th>\n                      <th>GC0</th>\n                      <th>GC1</th>\n                      <th>GC2</th>\n                      <th>Allocated (KB)</th>\n                    </thead>\n                    <tbody>\n                      <tr *ngFor=\"let t of job.info.tests\">\n                        <td>{{t.shortName}}</td>\n                        <td>{{t.duration}}</td>\n                        <td>{{t.referencedDuration}}</td>\n                        <td>{{t.gc0count}}</td>\n                        <td>{{t.gc1count}}</td>\n                        <td>{{t.gc2count}}</td>\n                        <td>{{t.allocated}}</td>\n                      </tr>\n                    </tbody>\n                  </table>\n                </li>\n          </ng-container>          \n        </ul>\n      </td>\n    </tr>\n  </tbody>\n</table>"

/***/ }),

/***/ "../../../../../src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_travis_api_service__ = __webpack_require__("../../../../../src/app/services/travis-api.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__("../../../common/@angular/common/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_operators_map__ = __webpack_require__("../../../../rxjs/operators/map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_operators_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_operators_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_chart_js__ = __webpack_require__("../../../../chart.js/src/chart.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_chart_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_chart_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__definitions_travis_definitions__ = __webpack_require__("../../../../../src/app/definitions/travis-definitions.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__definitions_common__ = __webpack_require__("../../../../../src/app/definitions/common.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__utils_common__ = __webpack_require__("../../../../../src/app/utils/common.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









let AppComponent = class AppComponent {
    constructor(httpClient, travisApi) {
        this.httpClient = httpClient;
        this.travisApi = travisApi;
        this.travisApi.auth().then((user) => {
            this.user = __WEBPACK_IMPORTED_MODULE_6__definitions_travis_definitions__["a" /* TravisDefinitions */].toCommonUser(user);
        });
        this.travisApi.getBuilds().then((builds) => {
            this.builds = builds.map(build => __WEBPACK_IMPORTED_MODULE_6__definitions_travis_definitions__["a" /* TravisDefinitions */].toCommonBuild(build));
            this.prepareChart(this.builds);
            this.branchLastResult = this.prepareLastBuilds(this.builds);
        });
    }
    prepareChart(builds) {
        const dt = __WEBPACK_IMPORTED_MODULE_5_lodash__["flatMap"](builds, b => b.jobs.filter(j => !__WEBPACK_IMPORTED_MODULE_5_lodash__["isNil"](j.info)).map(j => {
            return {
                label: b.commit.branch + '(' + b.number + ')',
                message: b.commit.message,
                time: j.info.time.toMilliseconds(),
                referenceTime: j.info.referenceTime && j.info.referenceTime.toMilliseconds()
            };
        }))
            .filter(job => !__WEBPACK_IMPORTED_MODULE_5_lodash__["isNil"](job.referenceTime));
        const labels = dt.map(j => j.label);
        const data = dt.map(j => j.time / j.referenceTime);
        const colors = dt.map(j => Object(__WEBPACK_IMPORTED_MODULE_8__utils_common__["b" /* randomColorGenerator */])());
        const ctx = document.getElementById('performanceChart').getContext('2d');
        const chart = new __WEBPACK_IMPORTED_MODULE_4_chart_js__["Chart"](ctx, {
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
    prepareLastBuilds(builds) {
        const allBuilds = __WEBPACK_IMPORTED_MODULE_5_lodash__["flatMap"](builds, b => b.jobs.filter(j => !__WEBPACK_IMPORTED_MODULE_5_lodash__["isNil"](j.info)).map(j => {
            return {
                id: b.number,
                branch: b.commit.branch,
                fullTime: j.info.time,
                referenceTime: j.info.referenceTime,
                time: j.info.referenceTime && __WEBPACK_IMPORTED_MODULE_7__definitions_common__["b" /* Time */].fromMilliSeconds(j.info.referenceTime.toMilliseconds() / j.info.time.toMilliseconds())
            };
        }));
        const lastBuilds = __WEBPACK_IMPORTED_MODULE_5_lodash__["map"](__WEBPACK_IMPORTED_MODULE_5_lodash__["groupBy"](allBuilds, b => b.branch), bs => __WEBPACK_IMPORTED_MODULE_5_lodash__["maxBy"](bs, b => b.id));
        return lastBuilds;
    }
};
AppComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["n" /* Component */])({
        selector: 'app-root',
        template: __webpack_require__("../../../../../src/app/app.component.html"),
        styles: [__webpack_require__("../../../../../src/app/app.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClient */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClient */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__services_travis_api_service__["a" /* TravisApiService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__services_travis_api_service__["a" /* TravisApiService */]) === "function" && _b || Object])
], AppComponent);

var _a, _b;
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ "../../../../../src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_app_veyor_api_service__ = __webpack_require__("../../../../../src/app/services/app-veyor-api.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_travis_api_service__ = __webpack_require__("../../../../../src/app/services/travis-api.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__ = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_common_http__ = __webpack_require__("../../../common/@angular/common/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






let AppModule = class AppModule {
};
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["L" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* AppComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_4__angular_common_http__["b" /* HttpClientModule */]
        ],
        providers: [__WEBPACK_IMPORTED_MODULE_1__services_travis_api_service__["a" /* TravisApiService */], __WEBPACK_IMPORTED_MODULE_0__services_app_veyor_api_service__["a" /* AppVeyorApiService */]],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ "../../../../../src/app/definitions/common.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_common__ = __webpack_require__("../../../../../src/app/utils/common.ts");

class Time {
    constructor(amount, measurement) {
        this.amount = amount;
        this.measurement = measurement;
    }
    static fromSeconds(seconds) {
        return new Time(seconds, 's');
    }
    static fromMilliSeconds(ms) {
        return new Time(ms, 'ms');
    }
    static fromDate(date) {
        return Time.fromMilliSeconds(date.getMilliseconds());
    }
    static fromDateString(date) {
        return Time.fromDate(new Date(date));
    }
    toMilliseconds() {
        return this.measurement === 'ms'
            ? this.amount
            : this.amount * 100;
    }
    toString() {
        return `${Object(__WEBPACK_IMPORTED_MODULE_0__utils_common__["a" /* prettify */])(this.amount)} ${this.measurement}`;
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = Time;

class MemoryAmount {
    constructor(amount, type) {
        this.amount = amount;
        this.type = type;
    }
    toString() {
        return `${Object(__WEBPACK_IMPORTED_MODULE_0__utils_common__["a" /* prettify */])(this.amount)} ${this.type}`;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MemoryAmount;

//# sourceMappingURL=common.js.map

/***/ }),

/***/ "../../../../../src/app/definitions/travis-definitions.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TravisDefinitions; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__("../../../../../src/app/definitions/common.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_log_parser__ = __webpack_require__("../../../../../src/app/utils/log-parser.ts");



var TravisDefinitions;
(function (TravisDefinitions) {
    function toCommonUser(user) {
        return {
            name: user.name,
            login: user.login,
            email: user.email,
            avatar_url: user.avatar_url
        };
    }
    TravisDefinitions.toCommonUser = toCommonUser;
    function toCommonBuild(build) {
        return {
            number: +build.number,
            commit: toCommonCommit(build.commit),
            duration: __WEBPACK_IMPORTED_MODULE_0__common__["b" /* Time */].fromMilliSeconds(build.duration),
            finished: new Date(build.finished_at),
            jobs: build.jobs.map(job => toCommonJob(job)),
            started: new Date(build.started_at),
            state: build.state
        };
    }
    TravisDefinitions.toCommonBuild = toCommonBuild;
    function toCommonCommit(commit) {
        return {
            branch: commit.branch,
            committed: new Date(commit.committed_at),
            committer_email: commit.committer_email,
            committer_name: commit.committer_name,
            message: commit.message
        };
    }
    TravisDefinitions.toCommonCommit = toCommonCommit;
    function toCommonJob(job) {
        return {
            finished: new Date(job.finished_at),
            started: new Date(job.started_at),
            state: job.state,
            info: __WEBPACK_IMPORTED_MODULE_1__utils_log_parser__["a" /* LogParser */].parseLog(job.log)
        };
    }
    TravisDefinitions.toCommonJob = toCommonJob;
})(TravisDefinitions || (TravisDefinitions = {}));
//# sourceMappingURL=travis-definitions.js.map

/***/ }),

/***/ "../../../../../src/app/services/app-veyor-api.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppVeyorApiService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__("../../../common/@angular/common/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let AppVeyorApiService = class AppVeyorApiService {
    constructor() { }
    getAppVeyorHeaders() {
        const headers = new __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["c" /* HttpHeaders */]({
            'Authorization': 'Bearer 7t97fs85nh82dj3fd71a'
        });
        return headers;
    }
};
AppVeyorApiService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [])
], AppVeyorApiService);

//# sourceMappingURL=app-veyor-api.service.js.map

/***/ }),

/***/ "../../../../../src/app/services/travis-api.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TravisApiService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__("../../../common/@angular/common/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let TravisApiService = class TravisApiService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    auth() {
        const headers = this.getJenkinsHeaders();
        return this.httpClient.get('https://api.travis-ci.org/users', {
            headers: headers
        })
            .toPromise()
            .then((res) => {
            return res.user;
        });
    }
    getBuilds() {
        const headers = this.getJenkinsHeaders();
        const params = new __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["d" /* HttpParams */]();
        return this.httpClient.get('https://api.travis-ci.org/repos/SayToMe/Solve/builds', {
            headers: headers
        })
            .toPromise()
            .then((res) => {
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
                        .then((r) => {
                        return this.httpClient.get('https://api.travis-ci.org/jobs/' + r.job.id + '/log', { responseType: 'text' })
                            .toPromise()
                            .then((log) => {
                            r.job.log = log;
                            return r.job;
                        });
                    });
                })).then((jobs) => {
                    build.jobs = jobs;
                    return build;
                });
            }));
        });
    }
    getJenkinsHeaders() {
        const headers = new __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["c" /* HttpHeaders */]({
            'Accept': 'application/vnd.travis-ci.2+json',
            'Authorization': 'token "uJeDK6yjk6Gt9HtfRNec-w"'
        });
        return headers;
    }
};
TravisApiService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["a" /* HttpClient */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["a" /* HttpClient */]) === "function" && _a || Object])
], TravisApiService);

var _a;
//# sourceMappingURL=travis-api.service.js.map

/***/ }),

/***/ "../../../../../src/app/utils/common.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = randomColorGenerator;
/* harmony export (immutable) */ __webpack_exports__["a"] = prettify;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);

function randomColorGenerator(opacity = 0.5) {
    const r = Math.random() * 256;
    const g = Math.random() * 256;
    const b = Math.random() * 256;
    return 'rgba(' + [r.toFixed(), g.toFixed(), b.toFixed(), opacity].join(',') + ')';
}
function prettify(val, digitsAfterDot = 2) {
    if (__WEBPACK_IMPORTED_MODULE_0_lodash__["isNil"](val)) {
        return val;
    }
    else if (__WEBPACK_IMPORTED_MODULE_0_lodash__["isNumber"](val)) {
        return val.toFixed(digitsAfterDot);
    }
    else {
        const dotIndex = val.indexOf('.');
        return dotIndex === -1
            ? val
            : val.slice(0, dotIndex + 3);
    }
}
//# sourceMappingURL=common.js.map

/***/ }),

/***/ "../../../../../src/app/utils/log-parser.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__definitions_common__ = __webpack_require__("../../../../../src/app/definitions/common.ts");


class LogParser {
    constructor() { }
    static parseLog(log) {
        const lines = log.split(/[\r\n]/);
        const executionRuntimeRegexp = /Execution Runtime: /;
        const fullTestInfoRegexp = /Tests run: (\d+), Errors: (\d+), Failures: (\d+), Inconclusive: (\d+), Time: (.+?) seconds/;
        const testInfoRegexp = /\*{5} Test (.+)\. Took (\d*\.?\d*) ms. GC collects: (-?\d+) (-?\d+) (-?\d+) Allocated: (\d*\.?\d*) KB\./;
        const startTestLineIdx = lines.findIndex(l => executionRuntimeRegexp.test(l));
        const endTestLineIdx = lines.findIndex(l => fullTestInfoRegexp.test(l));
        const tests = lines
            .slice(startTestLineIdx, endTestLineIdx)
            .filter(l => testInfoRegexp.test(l))
            .map(l => l.match(testInfoRegexp))
            .map(([str, name, duration, gc0, gc1, gc2, allocated]) => ({
            shortName: name.slice(name.lastIndexOf('.') + 1),
            fullName: name,
            duration: __WEBPACK_IMPORTED_MODULE_1__definitions_common__["b" /* Time */].fromMilliSeconds(+duration),
            referencedDuration: null,
            gc0count: +gc0,
            gc1count: +gc1,
            gc2count: +gc2,
            allocated: new __WEBPACK_IMPORTED_MODULE_1__definitions_common__["a" /* MemoryAmount */](+allocated, 'KB')
        }));
        const [fullString, testsNum, errors, failures, inconclusive, time] = lines[endTestLineIdx].match(fullTestInfoRegexp);
        const referenceTest = tests.find(t => t.shortName === 'reference test');
        const referenceTime = referenceTest && referenceTest.duration;
        if (!__WEBPACK_IMPORTED_MODULE_0_lodash__["isEmpty"](referenceTime)) {
            tests.forEach(t => {
                t.referencedDuration = __WEBPACK_IMPORTED_MODULE_1__definitions_common__["b" /* Time */].fromMilliSeconds(t.duration.toMilliseconds() / referenceTime.toMilliseconds());
            });
        }
        tests.forEach(t => {
            t.duration = t.duration;
        });
        return {
            testsCount: +testsNum,
            errorsCount: +errors,
            failuresCount: +failures,
            inconclusiveCount: +inconclusive,
            tests: tests,
            time: __WEBPACK_IMPORTED_MODULE_1__definitions_common__["b" /* Time */].fromMilliSeconds(+time * 100),
            referenceTime: referenceTime
        };
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = LogParser;

//# sourceMappingURL=log-parser.js.map

/***/ }),

/***/ "../../../../../src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const environment = {
    production: false
};
/* harmony export (immutable) */ __webpack_exports__["a"] = environment;

//# sourceMappingURL=environment.js.map

/***/ }),

/***/ "../../../../../src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("../../../platform-browser-dynamic/@angular/platform-browser-dynamic.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("../../../../../src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_19" /* enableProdMode */])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */])
    .catch(err => console.log(err));
//# sourceMappingURL=main.js.map

/***/ }),

/***/ "../../../../moment/locale recursive ^\\.\\/.*$":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": "../../../../moment/locale/af.js",
	"./af.js": "../../../../moment/locale/af.js",
	"./ar": "../../../../moment/locale/ar.js",
	"./ar-dz": "../../../../moment/locale/ar-dz.js",
	"./ar-dz.js": "../../../../moment/locale/ar-dz.js",
	"./ar-kw": "../../../../moment/locale/ar-kw.js",
	"./ar-kw.js": "../../../../moment/locale/ar-kw.js",
	"./ar-ly": "../../../../moment/locale/ar-ly.js",
	"./ar-ly.js": "../../../../moment/locale/ar-ly.js",
	"./ar-ma": "../../../../moment/locale/ar-ma.js",
	"./ar-ma.js": "../../../../moment/locale/ar-ma.js",
	"./ar-sa": "../../../../moment/locale/ar-sa.js",
	"./ar-sa.js": "../../../../moment/locale/ar-sa.js",
	"./ar-tn": "../../../../moment/locale/ar-tn.js",
	"./ar-tn.js": "../../../../moment/locale/ar-tn.js",
	"./ar.js": "../../../../moment/locale/ar.js",
	"./az": "../../../../moment/locale/az.js",
	"./az.js": "../../../../moment/locale/az.js",
	"./be": "../../../../moment/locale/be.js",
	"./be.js": "../../../../moment/locale/be.js",
	"./bg": "../../../../moment/locale/bg.js",
	"./bg.js": "../../../../moment/locale/bg.js",
	"./bn": "../../../../moment/locale/bn.js",
	"./bn.js": "../../../../moment/locale/bn.js",
	"./bo": "../../../../moment/locale/bo.js",
	"./bo.js": "../../../../moment/locale/bo.js",
	"./br": "../../../../moment/locale/br.js",
	"./br.js": "../../../../moment/locale/br.js",
	"./bs": "../../../../moment/locale/bs.js",
	"./bs.js": "../../../../moment/locale/bs.js",
	"./ca": "../../../../moment/locale/ca.js",
	"./ca.js": "../../../../moment/locale/ca.js",
	"./cs": "../../../../moment/locale/cs.js",
	"./cs.js": "../../../../moment/locale/cs.js",
	"./cv": "../../../../moment/locale/cv.js",
	"./cv.js": "../../../../moment/locale/cv.js",
	"./cy": "../../../../moment/locale/cy.js",
	"./cy.js": "../../../../moment/locale/cy.js",
	"./da": "../../../../moment/locale/da.js",
	"./da.js": "../../../../moment/locale/da.js",
	"./de": "../../../../moment/locale/de.js",
	"./de-at": "../../../../moment/locale/de-at.js",
	"./de-at.js": "../../../../moment/locale/de-at.js",
	"./de-ch": "../../../../moment/locale/de-ch.js",
	"./de-ch.js": "../../../../moment/locale/de-ch.js",
	"./de.js": "../../../../moment/locale/de.js",
	"./dv": "../../../../moment/locale/dv.js",
	"./dv.js": "../../../../moment/locale/dv.js",
	"./el": "../../../../moment/locale/el.js",
	"./el.js": "../../../../moment/locale/el.js",
	"./en-au": "../../../../moment/locale/en-au.js",
	"./en-au.js": "../../../../moment/locale/en-au.js",
	"./en-ca": "../../../../moment/locale/en-ca.js",
	"./en-ca.js": "../../../../moment/locale/en-ca.js",
	"./en-gb": "../../../../moment/locale/en-gb.js",
	"./en-gb.js": "../../../../moment/locale/en-gb.js",
	"./en-ie": "../../../../moment/locale/en-ie.js",
	"./en-ie.js": "../../../../moment/locale/en-ie.js",
	"./en-nz": "../../../../moment/locale/en-nz.js",
	"./en-nz.js": "../../../../moment/locale/en-nz.js",
	"./eo": "../../../../moment/locale/eo.js",
	"./eo.js": "../../../../moment/locale/eo.js",
	"./es": "../../../../moment/locale/es.js",
	"./es-do": "../../../../moment/locale/es-do.js",
	"./es-do.js": "../../../../moment/locale/es-do.js",
	"./es.js": "../../../../moment/locale/es.js",
	"./et": "../../../../moment/locale/et.js",
	"./et.js": "../../../../moment/locale/et.js",
	"./eu": "../../../../moment/locale/eu.js",
	"./eu.js": "../../../../moment/locale/eu.js",
	"./fa": "../../../../moment/locale/fa.js",
	"./fa.js": "../../../../moment/locale/fa.js",
	"./fi": "../../../../moment/locale/fi.js",
	"./fi.js": "../../../../moment/locale/fi.js",
	"./fo": "../../../../moment/locale/fo.js",
	"./fo.js": "../../../../moment/locale/fo.js",
	"./fr": "../../../../moment/locale/fr.js",
	"./fr-ca": "../../../../moment/locale/fr-ca.js",
	"./fr-ca.js": "../../../../moment/locale/fr-ca.js",
	"./fr-ch": "../../../../moment/locale/fr-ch.js",
	"./fr-ch.js": "../../../../moment/locale/fr-ch.js",
	"./fr.js": "../../../../moment/locale/fr.js",
	"./fy": "../../../../moment/locale/fy.js",
	"./fy.js": "../../../../moment/locale/fy.js",
	"./gd": "../../../../moment/locale/gd.js",
	"./gd.js": "../../../../moment/locale/gd.js",
	"./gl": "../../../../moment/locale/gl.js",
	"./gl.js": "../../../../moment/locale/gl.js",
	"./gom-latn": "../../../../moment/locale/gom-latn.js",
	"./gom-latn.js": "../../../../moment/locale/gom-latn.js",
	"./he": "../../../../moment/locale/he.js",
	"./he.js": "../../../../moment/locale/he.js",
	"./hi": "../../../../moment/locale/hi.js",
	"./hi.js": "../../../../moment/locale/hi.js",
	"./hr": "../../../../moment/locale/hr.js",
	"./hr.js": "../../../../moment/locale/hr.js",
	"./hu": "../../../../moment/locale/hu.js",
	"./hu.js": "../../../../moment/locale/hu.js",
	"./hy-am": "../../../../moment/locale/hy-am.js",
	"./hy-am.js": "../../../../moment/locale/hy-am.js",
	"./id": "../../../../moment/locale/id.js",
	"./id.js": "../../../../moment/locale/id.js",
	"./is": "../../../../moment/locale/is.js",
	"./is.js": "../../../../moment/locale/is.js",
	"./it": "../../../../moment/locale/it.js",
	"./it.js": "../../../../moment/locale/it.js",
	"./ja": "../../../../moment/locale/ja.js",
	"./ja.js": "../../../../moment/locale/ja.js",
	"./jv": "../../../../moment/locale/jv.js",
	"./jv.js": "../../../../moment/locale/jv.js",
	"./ka": "../../../../moment/locale/ka.js",
	"./ka.js": "../../../../moment/locale/ka.js",
	"./kk": "../../../../moment/locale/kk.js",
	"./kk.js": "../../../../moment/locale/kk.js",
	"./km": "../../../../moment/locale/km.js",
	"./km.js": "../../../../moment/locale/km.js",
	"./kn": "../../../../moment/locale/kn.js",
	"./kn.js": "../../../../moment/locale/kn.js",
	"./ko": "../../../../moment/locale/ko.js",
	"./ko.js": "../../../../moment/locale/ko.js",
	"./ky": "../../../../moment/locale/ky.js",
	"./ky.js": "../../../../moment/locale/ky.js",
	"./lb": "../../../../moment/locale/lb.js",
	"./lb.js": "../../../../moment/locale/lb.js",
	"./lo": "../../../../moment/locale/lo.js",
	"./lo.js": "../../../../moment/locale/lo.js",
	"./lt": "../../../../moment/locale/lt.js",
	"./lt.js": "../../../../moment/locale/lt.js",
	"./lv": "../../../../moment/locale/lv.js",
	"./lv.js": "../../../../moment/locale/lv.js",
	"./me": "../../../../moment/locale/me.js",
	"./me.js": "../../../../moment/locale/me.js",
	"./mi": "../../../../moment/locale/mi.js",
	"./mi.js": "../../../../moment/locale/mi.js",
	"./mk": "../../../../moment/locale/mk.js",
	"./mk.js": "../../../../moment/locale/mk.js",
	"./ml": "../../../../moment/locale/ml.js",
	"./ml.js": "../../../../moment/locale/ml.js",
	"./mr": "../../../../moment/locale/mr.js",
	"./mr.js": "../../../../moment/locale/mr.js",
	"./ms": "../../../../moment/locale/ms.js",
	"./ms-my": "../../../../moment/locale/ms-my.js",
	"./ms-my.js": "../../../../moment/locale/ms-my.js",
	"./ms.js": "../../../../moment/locale/ms.js",
	"./my": "../../../../moment/locale/my.js",
	"./my.js": "../../../../moment/locale/my.js",
	"./nb": "../../../../moment/locale/nb.js",
	"./nb.js": "../../../../moment/locale/nb.js",
	"./ne": "../../../../moment/locale/ne.js",
	"./ne.js": "../../../../moment/locale/ne.js",
	"./nl": "../../../../moment/locale/nl.js",
	"./nl-be": "../../../../moment/locale/nl-be.js",
	"./nl-be.js": "../../../../moment/locale/nl-be.js",
	"./nl.js": "../../../../moment/locale/nl.js",
	"./nn": "../../../../moment/locale/nn.js",
	"./nn.js": "../../../../moment/locale/nn.js",
	"./pa-in": "../../../../moment/locale/pa-in.js",
	"./pa-in.js": "../../../../moment/locale/pa-in.js",
	"./pl": "../../../../moment/locale/pl.js",
	"./pl.js": "../../../../moment/locale/pl.js",
	"./pt": "../../../../moment/locale/pt.js",
	"./pt-br": "../../../../moment/locale/pt-br.js",
	"./pt-br.js": "../../../../moment/locale/pt-br.js",
	"./pt.js": "../../../../moment/locale/pt.js",
	"./ro": "../../../../moment/locale/ro.js",
	"./ro.js": "../../../../moment/locale/ro.js",
	"./ru": "../../../../moment/locale/ru.js",
	"./ru.js": "../../../../moment/locale/ru.js",
	"./sd": "../../../../moment/locale/sd.js",
	"./sd.js": "../../../../moment/locale/sd.js",
	"./se": "../../../../moment/locale/se.js",
	"./se.js": "../../../../moment/locale/se.js",
	"./si": "../../../../moment/locale/si.js",
	"./si.js": "../../../../moment/locale/si.js",
	"./sk": "../../../../moment/locale/sk.js",
	"./sk.js": "../../../../moment/locale/sk.js",
	"./sl": "../../../../moment/locale/sl.js",
	"./sl.js": "../../../../moment/locale/sl.js",
	"./sq": "../../../../moment/locale/sq.js",
	"./sq.js": "../../../../moment/locale/sq.js",
	"./sr": "../../../../moment/locale/sr.js",
	"./sr-cyrl": "../../../../moment/locale/sr-cyrl.js",
	"./sr-cyrl.js": "../../../../moment/locale/sr-cyrl.js",
	"./sr.js": "../../../../moment/locale/sr.js",
	"./ss": "../../../../moment/locale/ss.js",
	"./ss.js": "../../../../moment/locale/ss.js",
	"./sv": "../../../../moment/locale/sv.js",
	"./sv.js": "../../../../moment/locale/sv.js",
	"./sw": "../../../../moment/locale/sw.js",
	"./sw.js": "../../../../moment/locale/sw.js",
	"./ta": "../../../../moment/locale/ta.js",
	"./ta.js": "../../../../moment/locale/ta.js",
	"./te": "../../../../moment/locale/te.js",
	"./te.js": "../../../../moment/locale/te.js",
	"./tet": "../../../../moment/locale/tet.js",
	"./tet.js": "../../../../moment/locale/tet.js",
	"./th": "../../../../moment/locale/th.js",
	"./th.js": "../../../../moment/locale/th.js",
	"./tl-ph": "../../../../moment/locale/tl-ph.js",
	"./tl-ph.js": "../../../../moment/locale/tl-ph.js",
	"./tlh": "../../../../moment/locale/tlh.js",
	"./tlh.js": "../../../../moment/locale/tlh.js",
	"./tr": "../../../../moment/locale/tr.js",
	"./tr.js": "../../../../moment/locale/tr.js",
	"./tzl": "../../../../moment/locale/tzl.js",
	"./tzl.js": "../../../../moment/locale/tzl.js",
	"./tzm": "../../../../moment/locale/tzm.js",
	"./tzm-latn": "../../../../moment/locale/tzm-latn.js",
	"./tzm-latn.js": "../../../../moment/locale/tzm-latn.js",
	"./tzm.js": "../../../../moment/locale/tzm.js",
	"./uk": "../../../../moment/locale/uk.js",
	"./uk.js": "../../../../moment/locale/uk.js",
	"./ur": "../../../../moment/locale/ur.js",
	"./ur.js": "../../../../moment/locale/ur.js",
	"./uz": "../../../../moment/locale/uz.js",
	"./uz-latn": "../../../../moment/locale/uz-latn.js",
	"./uz-latn.js": "../../../../moment/locale/uz-latn.js",
	"./uz.js": "../../../../moment/locale/uz.js",
	"./vi": "../../../../moment/locale/vi.js",
	"./vi.js": "../../../../moment/locale/vi.js",
	"./x-pseudo": "../../../../moment/locale/x-pseudo.js",
	"./x-pseudo.js": "../../../../moment/locale/x-pseudo.js",
	"./yo": "../../../../moment/locale/yo.js",
	"./yo.js": "../../../../moment/locale/yo.js",
	"./zh-cn": "../../../../moment/locale/zh-cn.js",
	"./zh-cn.js": "../../../../moment/locale/zh-cn.js",
	"./zh-hk": "../../../../moment/locale/zh-hk.js",
	"./zh-hk.js": "../../../../moment/locale/zh-hk.js",
	"./zh-tw": "../../../../moment/locale/zh-tw.js",
	"./zh-tw.js": "../../../../moment/locale/zh-tw.js"
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "../../../../moment/locale recursive ^\\.\\/.*$";

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map