import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

interface DashboardStats {
  totalMinions: number;
  acceptedMinions: number;
  pendingMinions: number;
  rejectedMinions: number;
  systemHealth: 'healthy' | 'warning' | 'error';
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalMinions: 0,
    acceptedMinions: 0,
    pendingMinions: 0,
    rejectedMinions: 0,
    systemHealth: 'healthy'
  };

  recentActivities: any[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    // Simular carregamento
    setTimeout(() => {
      this.stats = {
        totalMinions: 15,
        acceptedMinions: 12,
        pendingMinions: 2,
        rejectedMinions: 1,
        systemHealth: 'healthy'
      };

      this.recentActivities = [
        {
          id: 1,
          action: 'Minion Aceito',
          target: 'pdv-001',
          timestamp: new Date(Date.now() - 5 * 60000),
          status: 'success'
        },
        {
          id: 2,
          action: 'Comando Executado',
          target: 'pdv-002',
          timestamp: new Date(Date.now() - 15 * 60000),
          status: 'success'
        },
        {
          id: 3,
          action: 'Falha na Conexão',
          target: 'pdv-003',
          timestamp: new Date(Date.now() - 30 * 60000),
          status: 'error'
        }
      ];

      this.loading = false;
    }, 1500);
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  getHealthStatusIcon(): string {
    const icons = {
      healthy: 'fas fa-check-circle text-success',
      warning: 'fas fa-exclamation-triangle text-warning',
      error: 'fas fa-times-circle text-danger'
    };
    return icons[this.stats.systemHealth];
  }

  getHealthStatusText(): string {
    const texts = {
      healthy: 'Sistema Saudável',
      warning: 'Atenção Necessária',
      error: 'Problemas Detectados'
    };
    return texts[this.stats.systemHealth];
  }
}