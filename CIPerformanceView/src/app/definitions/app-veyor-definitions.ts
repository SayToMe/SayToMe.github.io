'use strict';

export module AppVeyorDefinitons {
    export interface IUser {
        accountId: number;
        accountName: string;
        isOwner: boolean;
        isCollaborator: boolean;
        userId: number;
        fullName: string;
        email: string;
        roleId: number;
        roleName: string;
        successfulBuildNotification: string;
        failedBuildNotification: string;
        notifyWhenBuildStatusChangedOnly: boolean;
        created: string;
        updated: string;
    }

    export interface IJob {
        jobId: string;
        name: string;
        allowFailure: boolean;
        messagesCount: number;
        compilationMessagesCount: number;
        compilationErrorsCount: number;
        compilationWarningsCount: number;
        testsCount: number;
        passedTestsCount: number;
        failedTestsCount: number;
        artifactsCount: number;
        status: string;
        started: string;
        finished: string;
        created: string;
        updated: string;
    }

    export interface IBuild {
        buildId: number;
        jobs: IJob[];
        buildNumber: number;
        version: string;
        message: string;
        branch: string;
        commitId: string;
        authorName: string;
        authorUsername: string;
        committerName: string;
        committerUsername: string;
        committed: string;
        messages: any[];
        status: string;
        started: string;
        finished: string;
        created: string;
        updated: string;
    }

    export interface ISecurityDescriptor {
        accessRightDefinitions: {
            name: string;
            description: string;
        }[];
        roleAces: {
            roleId: number;
            name: string;
            isAdmin: boolean;
            accessRights: {
                name: string;
                allowed: boolean;
            }[];
        }[];
        created: string;
        updated: string;
    }

    export interface IProject {
        projectId: number;
        accountId: number;
        accountName: string;
        builds: IBuild[];
        name: string;
        slug: string;
        repositoryType: string;
        repositoryScm: string;
        repositoryName: string;
        isPrivate: boolean;
        skipBranchesWithoutAppveyorYml: boolean;
        securityDescriptor: ISecurityDescriptor;
        created: string;
        updated: string;
    }

    export interface IProjectData<T> {
        project: IProject;
    }
}
