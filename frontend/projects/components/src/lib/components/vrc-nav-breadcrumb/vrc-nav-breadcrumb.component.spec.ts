import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, take } from 'rxjs';
import { ETokens } from '../../shared';
import { VrcNavBreadcrumbComponent } from './vrc-nav-breadcrumb.component';
import { VrcNavBreadcrumbModule } from './vrc-nav-breadcrumb.module';

@Pipe({
  name: 'translator',
  pure: false,
})
export class TranslatorPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    return value;
  }
}

describe('VrcNavBreadcrumbComponent', () => {
  let component: VrcNavBreadcrumbComponent;
  let fixture: ComponentFixture<VrcNavBreadcrumbComponent>;

  const events$ = new Subject<NavigationEnd>();
  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    events: events$.asObservable(),
  };

  const mockActivatedRoute = {
    root: {
      firstChild: {
        routeConfig: {
          data: {
            breadcrumb: [{ text: 'rede cadastro', link: 'cadastro' }],
          },
          path: 'rede',
        },
      },
      routeConfig: {
        data: {
          breadcrumb: [{ text: 'rede', link: 'consulta' }],
        },
        path: 'rede',
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VrcNavBreadcrumbModule],
      declarations: [VrcNavBreadcrumbComponent, TranslatorPipe],
      providers: [
        {
          provide: ETokens.TRANSLATOR_TOKEN,
          useClass: TranslatorPipe,
        },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VrcNavBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const end = new NavigationEnd(1, '', '');
    events$.next(end);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addRouterEvents', () => {
    it('should buildBreadCrumb on subscribe', (done) => {
      const event = new NavigationEnd(0, '', '');

      events$.pipe(take(1)).subscribe((ev) => {
        expect(ev).toEqual(event);
        done();
      });

      events$.next(event);
    });
  });
});
