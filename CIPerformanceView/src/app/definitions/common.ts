import { prettify } from '../utils/common';

export class Time {
    static fromSeconds(seconds: number) {
        return new Time(seconds, 's');
    }

    static fromMilliSeconds(ms: number) {
        return new Time(ms, 'ms');
    }

    static fromDate(date: Date) {
        return Time.fromMilliSeconds(date.getMilliseconds());
    }

    static fromDateString(date: string) {
        return Time.fromDate(new Date(date));
    }

    constructor(private amount: number, private measurement: 'ms' | 's') {}

    toMilliseconds() {
        return this.measurement === 'ms'
            ? this.amount
            : this.amount * 100;
    }

    toString() {
        return `${prettify(this.amount)} ${this.measurement}`;
    }
}

export class MemoryAmount {
    constructor(private amount: number, private type: string) { }

    toString() {
        return `${prettify(this.amount)} ${this.type}`;
    }
}

export interface IUser {
    name: string;
    login: string;
    email: string;
    avatar_url: string;
}

export interface IBuild {
    number: number;
    commit: ICommit;
    jobs: IJob[];

    started: Date;
    finished: Date;
    duration: Time;

    state: string;
}

export interface ICommit {
    branch: string;
    committed: Date;
    committer_email: string;
    committer_name: string;
    message: string;
}

export interface IJob {
    state: string;
    started: Date;
    finished: Date;

    info: IJobInfo;
}

export interface IJobInfo {
    testsCount: number;
    errorsCount: number;
    failuresCount: number;
    inconclusiveCount: number;

    time: Time;
    referenceTime: Time;

    tests: ITest[];
}

export interface ITest {
    shortName: string;
    fullName: string;

    duration: Time;
    referencedDuration: Time;

    gc0count: number;
    gc1count: number;
    gc2count: number;
    allocated: MemoryAmount;
}
