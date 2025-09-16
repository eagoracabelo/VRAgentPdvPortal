import { Component, Input, OnInit } from '@angular/core';
import { MinionSystemInfo } from '../../../core/domain/models/minion.model';
import { MinionRepository } from '../../../core/infrastructure/repositories/minion.repository';

@Component({
    selector: 'app-minion-system-info',
    templateUrl: './minion-system-info.component.html',
    styleUrls: ['./minion-system-info.component.scss']
})
export class MinionSystemInfoComponent implements OnInit {
    @Input() minionId!: string;
    @Input() compact: boolean = false;

    systemInfo: MinionSystemInfo | null = null;
    loading = false;
    error: string | null = null;

    constructor(private minionRepository: MinionRepository) { }

    ngOnInit(): void {
        if (this.minionId) {
            this.loadSystemInfo();
        }
    }

    loadSystemInfo(): void {
        this.loading = true;
        this.error = null;

        this.minionRepository.getMinionInfo(this.minionId).subscribe({
            next: (info: MinionSystemInfo) => {
                this.systemInfo = info;
                this.loading = false;
            },
            error: (error: any) => {
                this.error = 'Erro ao carregar informações do sistema';
                this.loading = false;
                console.error('Erro ao carregar info do minion:', error);
            }
        });
    }

    getOSIcon(): string {
        if (!this.systemInfo) return 'fas fa-desktop';

        const os = this.systemInfo.os.toLowerCase();
        const osFamily = this.systemInfo.os_family.toLowerCase();

        if (os.includes('windows') || osFamily.includes('windows')) {
            return 'fab fa-windows';
        } else if (os.includes('ubuntu')) {
            return 'fab fa-ubuntu';
        } else if (os.includes('centos') || os.includes('redhat') || os.includes('rhel')) {
            return 'fab fa-redhat';
        } else if (os.includes('debian')) {
            return 'fab fa-linux';
        } else if (os.includes('linux') || osFamily.includes('linux')) {
            return 'fab fa-linux';
        } else if (os.includes('darwin') || os.includes('macos')) {
            return 'fab fa-apple';
        } else {
            return 'fas fa-desktop';
        }
    }

    getOSColor(): string {
        if (!this.systemInfo) return '#6c757d';

        const os = this.systemInfo.os.toLowerCase();
        const osFamily = this.systemInfo.os_family.toLowerCase();

        if (os.includes('windows') || osFamily.includes('windows')) {
            return '#0078d4';
        } else if (os.includes('ubuntu')) {
            return '#e95420';
        } else if (os.includes('centos') || os.includes('redhat') || os.includes('rhel')) {
            return '#ee0000';
        } else if (os.includes('debian')) {
            return '#a81d33';
        } else if (os.includes('linux') || osFamily.includes('linux')) {
            return '#fcc624';
        } else if (os.includes('darwin') || os.includes('macos')) {
            return '#007aff';
        } else {
            return '#6c757d';
        }
    }

    getDisplayName(): string {
        if (!this.systemInfo) return 'Sistema Desconhecido';

        const os = this.systemInfo.os;
        const release = this.systemInfo.osrelease;
        const codename = this.systemInfo.oscodename;

        if (os.toLowerCase().includes('windows')) {
            return `Windows ${release}`;
        } else if (os.toLowerCase().includes('ubuntu')) {
            return `Ubuntu ${release}${codename ? ` (${codename})` : ''}`;
        } else if (os.toLowerCase().includes('centos')) {
            return `CentOS ${release}`;
        } else if (os.toLowerCase().includes('debian')) {
            return `Debian ${release}${codename ? ` (${codename})` : ''}`;
        } else {
            return `${os} ${release}`;
        }
    }

    getArchitectureIcon(): string {
        if (!this.systemInfo) return 'fas fa-microchip';

        const arch = this.systemInfo.cpuarch.toLowerCase();

        if (arch.includes('x86_64') || arch.includes('amd64')) {
            return 'fas fa-microchip';
        } else if (arch.includes('arm') || arch.includes('aarch64')) {
            return 'fas fa-mobile-alt';
        } else {
            return 'fas fa-microchip';
        }
    }

    formatMemory(bytes: number): string {
        if (bytes === 0) return '0 MB';

        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        const size = (bytes / Math.pow(1024, i)).toFixed(1);

        return `${size} ${sizes[i]}`;
    }

    getMainIP(): string {
        if (!this.systemInfo?.ip4_interfaces) return 'N/A';

        // Tentar encontrar um IP não-localhost
        for (const [interface_name, ips] of Object.entries(this.systemInfo.ip4_interfaces)) {
            if (interface_name !== 'lo' && ips.length > 0) {
                const nonLocalIP = ips.find(ip => !ip.startsWith('127.'));
                if (nonLocalIP) return nonLocalIP;
            }
        }

        return 'N/A';
    }
}