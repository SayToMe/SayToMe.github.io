'use strict';

import * as Common from './common';

import { LogParser } from '../utils/log-parser';

export module TravisDefinitions {
    export interface IUser {
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

    export function toCommonUser(user: IUser) {
        return <Common.IUser>{
            name: user.name,
            login: user.login,
            email: user.email,
            avatar_url: user.avatar_url
        };
    }

    export interface IBuild {
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

    export function toCommonBuild(build: IBuild) {
        return <Common.IBuild>{
            number: +build.number,
            commit: toCommonCommit(build.commit),
            duration: Common.Time.fromMilliSeconds(build.duration),
            finished: new Date(build.finished_at),
            jobs: build.jobs.map(job => toCommonJob(job)),
            started: new Date(build.started_at),
            state: build.state
        };
    }

    export interface ICommit {
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

    export function toCommonCommit(commit: ICommit) {
        return <Common.ICommit>{
            branch: commit.branch,
            committed: new Date(commit.committed_at),
            committer_email: commit.committer_email,
            committer_name: commit.committer_name,
            message: commit.message
        };
    }

    export interface IJob {
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
    }

    export function toCommonJob(job: IJob) {
        return <Common.IJob>{
            finished: new Date(job.finished_at),
            started: new Date(job.started_at),
            state: job.state,
            info: LogParser.parseLog(job.log)
        };
    }
}

