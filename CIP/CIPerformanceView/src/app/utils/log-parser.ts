import * as _ from 'lodash';

import { IJobInfo, ITest, Time, MemoryAmount } from '../definitions/common';

export class LogParser {
    private constructor() { }

    static parseLog(log: string) {
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
            .map(([str, name, duration, gc0, gc1, gc2, allocated]) => (<ITest>{
                shortName: name.slice(name.lastIndexOf('.') + 1),
                fullName: name,
                duration: Time.fromMilliSeconds(+duration),
                referencedDuration: null,
                gc0count: +gc0,
                gc1count: +gc1,
                gc2count: +gc2,
                allocated: new MemoryAmount(+allocated, 'KB')
            }));

        const [fullString, testsNum, errors, failures, inconclusive, time] = lines[endTestLineIdx].match(fullTestInfoRegexp);
        const referenceTest = tests.find(t => t.shortName === 'reference test');
        const referenceTime = referenceTest && referenceTest.duration;

        if (!_.isEmpty(referenceTime)) {
            tests.forEach(t => {
                t.referencedDuration = Time.fromMilliSeconds(t.duration.toMilliseconds() / referenceTime.toMilliseconds());
            });
        }

        tests.forEach(t => {
            t.duration = t.duration;
        });

        return <IJobInfo>{
            testsCount: +testsNum,
            errorsCount: +errors,
            failuresCount: +failures,
            inconclusiveCount: +inconclusive,
            tests: tests,
            time: Time.fromMilliSeconds(+time * 100),
            referenceTime: referenceTime
        };
    }
}
