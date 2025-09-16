import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, combineLatest, timer, of } from 'rxjs';
import { takeUntil, switchMap, finalize, catchError } from 'rxjs/operators';
import { SaltApiService } from '../../../../core/service/salt-api.service';
import { MockSaltApiService } from '../../../../core/service/mock-salt-api.service';
import { MinionUseCase } from '../../../../core/application/use-cases/minion.use-case';
import { AdminOverview, JobDto } from '../../../../core/domain/models/management.model';
import { NotificationMessage } from '../../../../shared/components/notification/notification.component';

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
  notification: NotificationMessage | null = null;

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

  onVersionOperationComplete(event: { operation: string, success: boolean, message: string }): void {
    console.log('Operação de versão completada:', event);

    if (event.success) {
      // Mostrar notificação de sucesso
      this.showNotification({
        type: 'success',
        title: `${this.capitalizeOperation(event.operation)} realizado com sucesso`,
        message: event.message,
        duration: 5000
      });

      // Recarregar dados do dashboard após operações de deploy/rollback
      if (['deploy', 'rollback'].includes(event.operation)) {
        setTimeout(() => {
          this.refreshAllData().subscribe({
            next: (overview) => {
              this.adminOverview$ = of(overview);
            },
            error: (error) => {
              console.error('Erro ao recarregar dashboard após operação:', error);
            }
          });
        }, 1000); // Aguardar 1 segundo para a operação ser processada
      }
    } else {
      // Mostrar notificação de erro
      this.showNotification({
        type: 'error',
        title: `Erro no ${this.capitalizeOperation(event.operation)}`,
        message: event.message,
        duration: 8000
      });
    }
  }

  onMinionOperationComplete(event: { operation: string, success: boolean, message: string, minionId: string }): void {
    console.log('Operação de minion completada:', event);

    if (event.success) {
      // Mostrar notificação de sucesso
      this.showNotification({
        type: 'success',
        title: `${this.capitalizeMinionOperation(event.operation)} realizado com sucesso`,
        message: event.message,
        duration: 5000
      });

      // Recarregar dados do dashboard após operações de minion para atualizar contadores
      setTimeout(() => {
        this.refreshAllData().subscribe({
          next: (overview: AdminOverview) => {
            this.adminOverview$ = of(overview);
          },
          error: (error: any) => {
            console.error('Erro ao recarregar dashboard após operação de minion:', error);
          }
        });
      }, 1000);
    } else {
      // Mostrar notificação de erro
      this.showNotification({
        type: 'error',
        title: `Erro no ${this.capitalizeMinionOperation(event.operation)}`,
        message: event.message,
        duration: 8000
      });
    }
  }

  private showNotification(notification: NotificationMessage): void {
    this.notification = notification;
  }

  onNotificationClose(): void {
    this.notification = null;
  }

  private capitalizeOperation(operation: string): string {
    const operations: { [key: string]: string } = {
      'upload': 'Upload',
      'deploy': 'Deploy',
      'rollback': 'Rollback',
      'test': 'Teste',
      'delete': 'Exclusão'
    };
    return operations[operation] || operation;
  }

  private capitalizeMinionOperation(operation: string): string {
    const operations: { [key: string]: string } = {
      'accept': 'Aprovação de Minion',
      'reject': 'Rejeição de Minion',
      'deny': 'Negação de Minion'
    };
    return operations[operation] || operation;
  }
}