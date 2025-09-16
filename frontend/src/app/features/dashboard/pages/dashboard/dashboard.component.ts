import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, combineLatest, timer, of } from 'rxjs';
import { takeUntil, switchMap, finalize, catchError } from 'rxjs/operators';
import { SaltApiService } from '../../../../core/service/salt-api.service';
import { MockSaltApiService } from '../../../../core/service/mock-salt-api.service';
import { MinionUseCase } from '../../../../core/application/use-cases/minion.use-case';
import { AdminOverview, JobDto } from '../../../../core/domain/models/management.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Dados do Salt API
  adminOverview$!: Observable<AdminOverview>;

  // Estados
  loading = false;
  error: string | null = null;
  selectedMinion = '*';
  refreshInterval = 60000; // 60 segundos - Salt API pode ser lenta

  constructor(
    private saltApiService: SaltApiService,
    private mockSaltApiService: MockSaltApiService,
    private minionUseCase: MinionUseCase
  ) { }

  ngOnInit(): void {
    this.setupDataStreams();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupDataStreams(): void {
    // Usar mock service para testar o dashboard
    this.adminOverview$ = this.saltApiService.getAdminOverview(this.selectedMinion);
  }

  private startAutoRefresh(): void {
    // Fazer a primeira chamada imediatamente, depois configurar o timer
    this.refreshAllData().pipe(
      catchError(error => {
        if (error.name === 'TimeoutError') {
          this.error = 'Timeout: A API Salt está demorando mais que o esperado. Aguarde ou verifique a conectividade.';
        } else {
          this.error = 'Erro ao carregar dados do SaltStack. Verifique se o backend está rodando.';
        }
        console.error('Erro:', error);
        return of({
          minionsStatus: { up: [], down: [], pending: [] },
          recentJobs: [],
          systemSummary: {
            cpu: [],
            memory: [],
            disk: [],
            processes: [],
            network: []
          }
        } as AdminOverview);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (overview) => {
        this.adminOverview$ = of(overview);
        // Só configurar o auto-refresh após primeira carga bem-sucedida
        this.scheduleNextRefresh();
      }
    });
  }

  private scheduleNextRefresh(): void {
    timer(this.refreshInterval).pipe(
      switchMap(() => this.refreshAllData().pipe(
        catchError(error => {
          console.error('Erro no auto-refresh:', error);
          // Em caso de erro no auto-refresh, não atualizar os dados, manter os existentes
          return of(null);
        })
      )),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (overview) => {
        if (overview) {
          this.adminOverview$ = of(overview);
        }
        // Reagendar próximo refresh
        this.scheduleNextRefresh();
      }
    });
  }

  refreshAllData(): Observable<AdminOverview> {
    this.loading = true;
    this.error = null;

    return this.saltApiService.getAdminOverview(this.selectedMinion).pipe(
      finalize(() => this.loading = false)
    );
  }

  pingAllMinions(): void {
    this.saltApiService.pingAllMinions().subscribe({
      next: (result) => {
        console.log('Ping results:', result);
      },
      error: (error) => {
        this.error = 'Erro ao executar ping nos minions';
        console.error(error);
      }
    });
  }

  onMinionSelect(minionId: string): void {
    this.selectedMinion = minionId;
    this.setupDataStreams();
  }

  clearError(): void {
    this.error = null;
  }

  getLastUpdateTime(): string {
    return new Date().toLocaleTimeString('pt-BR');
  }
}