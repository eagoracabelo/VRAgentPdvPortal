// Modelos para System Info
export interface SystemInfoDto {
    minionId: string;
    os: string;
    osFamily: string;
    osRelease: string;
    kernel: string;
    architecture: string;
    saltVersion: string;
    pythonVersion: string;
    fqdn: string;
    ipv4: string[];
    cpuArch: string;
    virtual: string;
}

// Modelos para Monitoring
export interface CpuInfoDto {
    minionId: string;
    usage: number;
    loadAverage: number[];
    cores: number;
    processes: number;
}

export interface MemoryInfoDto {
    minionId: string;
    total: number;
    available: number;
    used: number;
    free: number;
    cached: number;
    buffers: number;
    swapTotal: number;
    swapUsed: number;
    swapFree: number;
}

export interface DiskInfoDto {
    minionId: string;
    mountPoint: string;
    filesystem: string;
    total: number;
    used: number;
    available: number;
    usedPercent: number;
}

export interface ProcessInfoDto {
    minionId: string;
    pid: number;
    name: string;
    cpu: number;
    memory: number;
    status: string;
}

export interface NetworkMonitorDto {
    minionId: string;
    interface: string;
    ip: string;
    bytesReceived: number;
    bytesSent: number;
    packetsReceived: number;
    packetsSent: number;
}

// Modelos para Jobs
export interface JobDto {
    jid: string;
    function: string;
    target: string;
    user: string;
    timestamp: Date;
    status: string;
}

export interface JobDetailDto {
    jid: string;
    function: string;
    target: string;
    user: string;
    timestamp: Date;
    result: any;
    success: boolean;
    duration: number;
}

// Overview completo
export interface AdminOverview {
    minionsStatus: {
        up: string[];
        down: string[];
        pending: string[]
    }
    recentJobs: JobDto[];
    systemSummary: {
        cpu: CpuInfoDto[];
        memory: MemoryInfoDto[];
        disk: DiskInfoDto[];
        processes: ProcessInfoDto[];
        network: NetworkMonitorDto[];
    };
}

export interface OsInfoDto {
    minionId: string;
    os: String,
    osRelease: String,
    kernel: String
}

export interface HardwareInfoDto {
    minionId: string;
    numCpus: number;
    memTotal: number;
    virtual: string;
}
