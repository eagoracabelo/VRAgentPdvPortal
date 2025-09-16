// Modelos para App Version Management
export interface AppVersionResultDto {
    success: boolean;
    message: string;
    version?: string;
    affectedMinions?: string[];
    errors?: string[];
    details?: any;
    timestamp?: string;
}

export interface AppVersionInfo {
    version: string;
    description?: string;
    uploadDate: string;
    size: number;
    status: 'AVAILABLE' | 'DEPLOYED' | 'DEPRECATED';
    deployedOn?: string[];
}

export interface AppVersionListDto {
    versions: AppVersionInfo[];
    currentActive?: string;
    totalVersions: number;
}

export interface MinionVersionInfo {
    minionId: string;
    currentVersion?: string;
    status: 'ONLINE' | 'OFFLINE' | 'UNKNOWN';
    lastUpdate?: string;
    canUpdate: boolean;
}

export interface DeploymentStatus {
    inProgress: boolean;
    startTime?: string;
    estimatedCompletion?: string;
    completedMinions: string[];
    failedMinions: string[];
    pendingMinions: string[];
    totalMinions: number;
    progress: number; // 0-100
}