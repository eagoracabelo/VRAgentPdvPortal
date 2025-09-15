import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { VrcBreadCrumbService } from './vrc-breadcrumb.service';

describe('VrcBreadCrumbService', () => {
  let service: VrcBreadCrumbService;

  const mockRouter = {
    url: '/dashboard/registration/editar/1',
  };

  const mockActivatedRoute: any = {
    routeConfig: {
      data: {
        breadcrumbItems: [
          { text: 'PROJECT-NAME' },
          { text: 'COMMONS.OPERATION' },
          { text: 'COMMONS.REGISTRATION' },
          { text: 'COMMONS.DIVISAO-FORNECEDOR' },
          { text: 'COMMONS.CONSULTATION' },
        ],
      },
    },
    firstChild: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VrcBreadCrumbService,
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute,
        },
      ],
    });
    service = TestBed.inject(VrcBreadCrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('buildBreadCrumb', () => {
    it('should build bread crumbs with data', () => {
      mockRouter.url = '/dashboard/registration/editar/1';
      const result = service.buildBreadCrumb(mockActivatedRoute);

      expect(result).toEqual([]);
    });

    it('should build bread crumbs without data', () => {
      mockActivatedRoute.routeConfig.data = {};
      mockRouter.url = '/dashboard/registration/editar/1';
      const result = service.buildBreadCrumb(mockActivatedRoute);
      expect(result).toEqual([]);
    });

    it('should build bread crumbs with last item as EDIT', () => {
      mockActivatedRoute.routeConfig.data.breadcrumbItems = [
        { text: 'PROJECT-NAME' },
        { text: 'COMMONS.OPERATION' },
        { text: 'COMMONS.REGISTRATION' },
        { text: 'COMMONS.DIVISAO-FORNECEDOR' },
        { text: 'COMMONS.EDIT' },
      ];
      mockRouter.url = '/dashboard/registration/editar/1';
      const result = service.buildBreadCrumb(mockActivatedRoute);

      expect(result).toEqual([]);
    });

    it('should build with breadcrumbItems complete', () => {
      mockActivatedRoute.routeConfig.data.breadcrumbItems = [
        { text: 'PROJECT-NAME' },
        { text: 'COMMONS.OPERATION' },
        { text: 'COMMONS.REGISTRATION' },
        { text: 'COMMONS.DIVISAO-FORNECEDOR' },
        { text: 'COMMONS.EDIT' },
      ];

      mockRouter.url = '/dashboard';
      const result = service.buildBreadCrumb(mockActivatedRoute);

      expect(result).toEqual([]);
    });

    it('should build with breadcrumbItems not complete', () => {
      mockActivatedRoute.routeConfig.data.breadcrumbItems = [
        { text: 'PROJECT-NAME' },
        { text: 'COMMONS.OPERATION' },
      ];
      mockRouter.url = '/dashboard';
      const result = service.buildBreadCrumb(mockActivatedRoute);

      expect(result).toEqual([]);
    });

    it('should build bread crumbs without items', () => {
      mockRouter.url = '/dashboard/registration/editar/1';
      mockActivatedRoute.routeConfig.data.breadcrumbItems = [];
      const result = service.buildBreadCrumb(mockActivatedRoute);
      expect(result).toEqual([]);
    });
  });
});
