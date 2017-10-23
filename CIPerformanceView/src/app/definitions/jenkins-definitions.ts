'use strict';

export module JenkinsDefinitions {
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
}
