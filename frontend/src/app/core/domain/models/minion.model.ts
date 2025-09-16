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
    systemInfo?: MinionSystemInfo;
}

export interface MinionSystemInfo {
    os: string;
    os_family: string;
    osrelease: string;
    oscodename?: string;
    kernel: string;
    kernelrelease: string;
    cpu_model: string;
    cpuarch: string;
    num_cpus: number;
    mem_total: number;
    ip4_interfaces: { [key: string]: string[] };
    fqdn: string;
    host: string;
    saltversion: string;
    pythonversion: string[];
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