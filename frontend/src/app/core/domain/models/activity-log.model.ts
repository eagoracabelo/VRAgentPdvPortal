export interface ActivityLog {
    id: number;
    userId: number;
    action: string;
    target: string;
    status: ActivityStatus;
    timestamp: Date;
    errorMessage?: string;
    details?: Record<string, any>;
}

export enum ActivityStatus {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE'
}

export interface CommandRequest {
    command: string;
}

export interface FileManagementRequest {
    sourcePath: string;
    destinationPath: string;
}