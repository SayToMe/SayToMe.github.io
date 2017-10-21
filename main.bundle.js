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

module.exports = "<span class=\"pull-right\" *ngIf=\"user\">Logged as {{user.name || 'Unknown'}}</span>\n<span class=\"pull-right\" *ngIf=\"!user\">Authorizing</span>\n\n<!-- <a href=\"https://api.travis-ci.com/auth/handshake\">log in</a> -->\n\n<h3>Builds</h3>\n<table *ngIf=\"builds && builds.length > 0\">\n  <thead>\n    <th>Number</th>\n    <th>Finished</th>\n    <th>State</th>\n    <th>Message</th>\n    <th>Misc</th>\n  </thead>\n  <tbody>\n    <tr *ngFor=\"let build of builds\">\n      <td>\n          {{build.number}}\n      </td>\n      <td>\n         {{build.finished_at}}\n      </td>\n      <td>\n          {{build.state}}\n      </td>\n      <td>\n          {{build.commit.message}}\n      </td>\n      <td>\n        <ul *ngIf=\"build.jobs\">\n          <ng-container *ngFor=\"let job of build.jobs\">\n              <li *ngIf=\"job.parsed\">\n                  Run: {{job.parsed.testsNum}}. Failures: {{job.parsed.failures}}. Total time: {{job.parsed.time}}.\n                  <table *ngIf=\"job.parsed.tests && job.parsed.tests.length > 0\">\n                    <thead>\n                      <th>Name</th>\n                      <th>Duration (ms)</th>\n                      <th>GC0</th>\n                      <th>GC1</th>\n                      <th>GC2</th>\n                      <th>Allocated (KB)</th>\n                    </thead>\n                    <tbody>\n                      <tr *ngFor=\"let t of job.parsed.tests\">\n                        <td>{{t.shortName}}</td>\n                        <td>{{t.duration}}</td>\n                        <td>{{t.collect0}}</td>\n                        <td>{{t.collect1}}</td>\n                        <td>{{t.collect2}}</td>\n                        <td>{{t.allocated}}</td>\n                      </tr>\n                    </tbody>\n                  </table>\n                </li>\n          </ng-container>          \n        </ul>\n      </td>\n    </tr>\n  </tbody>\n</table>"

/***/ }),

/***/ "../../../../../src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/@angular/common/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_operators_map__ = __webpack_require__("../../../../rxjs/operators/map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_operators_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AppComponent = (function () {
    function AppComponent(httpClient) {
        this.httpClient = httpClient;
        this.auth();
        this.getBuilds();
    }
    AppComponent.prototype.auth = function () {
        var _this = this;
        var headers = this.getHeaders();
        return this.httpClient.get('https://api.travis-ci.org/users', {
            headers: headers
        })
            .toPromise()
            .then(function (res) {
            _this.user = res.user;
            return res.user;
        });
    };
    AppComponent.prototype.getBuilds = function () {
        var _this = this;
        var headers = this.getHeaders();
        var params = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["d" /* HttpParams */]();
        this.httpClient.get('https://api.travis-ci.org/repos/SayToMe/Solve/builds', {
            headers: headers
        })
            .toPromise()
            .then(function (res) {
            _this.builds = res.builds;
            _this.builds.forEach(function (build) {
                build.commit = res.commits.find(function (c) { return c.id === build.commit_id; });
            });
            _this.builds.forEach(function (build) {
                build.jobs = [];
                build.job_ids.forEach(function (jobId) {
                    return _this.httpClient.get('https://api.travis-ci.org/jobs/' + jobId, {
                        headers: headers
                    })
                        .toPromise()
                        .then(function (r) {
                        build.jobs.push(r.job);
                        return _this.httpClient.get('https://api.travis-ci.org/jobs/' + r.job.id + '/log', { responseType: 'text' })
                            .toPromise()
                            .then(function (log) {
                            r.job.log = log;
                            r.job.parsed = _this.parseLog(log);
                        });
                    });
                });
            });
            return res.builds;
        });
    };
    AppComponent.prototype.parseLog = function (log) {
        var lines = log.split(/[\r\n]/);
        var r = /Execution Runtime: /;
        var r2 = /Tests run: (\d+), Errors: (\d+), Failures: (\d+), Inconclusive: (\d+), Time: (.+?) seconds/;
        var testCheck = /\*\*\*\*\*/;
        var r3 = /\*\*\*\*\* Test (.+)\. Took (\d*\.?\d*) ms. GC collects: (-?\d+) (-?\d+) (-?\d+) Allocated: (\d*\.?\d*) KB\./;
        var startTestLineIdx = lines.findIndex(function (l) { return r.test(l); });
        var endTestLineIdx = lines.findIndex(function (l) { return r2.test(l); });
        var tests = lines.slice(startTestLineIdx, endTestLineIdx).filter(function (l) { return r3.test(l); }).map(function (l) { return l.match(r3); }).map(function (rs) {
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
        var _a = lines[endTestLineIdx].match(r2), _ = _a[0], testsNum = _a[1], errors = _a[2], failures = _a[3], inconclusive = _a[4], time = _a[5];
        return {
            testsNum: testsNum,
            errors: errors,
            failures: failures,
            inconclusive: inconclusive,
            time: time,
            tests: tests
        };
    };
    AppComponent.prototype.getHeaders = function () {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({
            'Accept': 'application/vnd.travis-ci.2+json',
            'Authorization': 'token "uJeDK6yjk6Gt9HtfRNec-w"'
        });
        return headers;
    };
    return AppComponent;
}());
AppComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'app-root',
        template: __webpack_require__("../../../../../src/app/app.component.html"),
        styles: [__webpack_require__("../../../../../src/app/app.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */]) === "function" && _a || Object])
], AppComponent);

var _a;
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ "../../../../../src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__("../../../common/@angular/common/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["L" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* AppComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["b" /* HttpClientModule */]
        ],
        providers: [],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ "../../../../../src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// The file contents for the current environment will overwrite these during build.
var environment = {
    production: false
};
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
    .catch(function (err) { return console.log(err); });
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map