export interface MinionKeys {
    minions: string[];
    minions_pre: string[];
    minions_rejected: string[];
    minions_denied: string[];
}

export interface Minion {
    id: string;
    status: MinionStatus;
    lastSeen?: Date;
    version?: string;
}

export enum MinionStatus {
    ACCEPTED = 'accepted',
    PENDING = 'pending',
    REJECTED = 'rejected',
    DENIED = 'denied'
}

export interface MinionStats {
    total: number;
    accepted: number;
    pending: number;
    rejected: number;
    denied: number;
}