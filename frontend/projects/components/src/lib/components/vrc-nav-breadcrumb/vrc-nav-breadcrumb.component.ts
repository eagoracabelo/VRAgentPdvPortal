import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter, Subscription } from 'rxjs';
import { VrcBreadCrumbService } from '../../services/vrc-breadcrumb.service';
import { IBreadCrumb } from './interfaces/breadcrumb.interface';

@Component({
  selector: 'vrc-nav-breadcrumb',
  templateUrl: './vrc-nav-breadcrumb.component.html',
  styleUrls: ['./vrc-nav-breadcrumb.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VrcNavBreadcrumbComponent implements OnInit, OnDestroy {
  @HostBinding('class') classes = 'navbar__breadcrumb';

  @Input() projectName!: string;

  public breadcrumbs = signal<IBreadCrumb[]>([]);

  private readonly _subs: Subscription[] = [];

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly vrcBreadCrumbService: VrcBreadCrumbService,
  ) {
    this.breadcrumbs.set(
      this.vrcBreadCrumbService.buildBreadCrumb(this.activatedRoute.root),
    );
  }

  ngOnInit(): void {
    this.addRouterEvents();
  }

  addRouterEvents(): void {
    this._subs.push(
      this.router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          distinctUntilChanged(),
        )
        .subscribe(() => {
          this.breadcrumbs.set(
            this.vrcBreadCrumbService.buildBreadCrumb(this.activatedRoute.root),
          );
        }),
    );
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
