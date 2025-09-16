import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, combineLatest, timer } from 'rxjs';
import { takeUntil, switchMap, finalize } from 'rxjs/operators';
import { SaltApiService } from '../../../../core/service/salt-api.service';
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
  refreshInterval = 30000; // 30 segundos

  constructor(
    private saltApiService: SaltApiService,
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
    this.adminOverview$ = this.saltApiService.getAdminOverview(this.selectedMinion);
  }

  private startAutoRefresh(): void {
    timer(0, this.refreshInterval).pipe(
      switchMap(() => this.refreshAllData()),
      takeUntil(this.destroy$)
    ).subscribe({
      error: (error) => {
        this.error = 'Erro ao carregar dados do SaltStack';
        console.error('Erro:', error);
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