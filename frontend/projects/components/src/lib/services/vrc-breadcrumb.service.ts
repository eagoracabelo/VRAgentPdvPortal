import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IBreadCrumb } from '../components/vrc-nav-breadcrumb/interfaces/breadcrumb.interface';

@Injectable({
  providedIn: 'root',
})
export class VrcBreadCrumbService {
  constructor(private readonly router: Router) {}

  buildBreadCrumb(route: ActivatedRoute): IBreadCrumb[] {
    let breadcrumbs: IBreadCrumb[] = [];
    const items =
      (route.routeConfig?.data?.['breadcrumbItems'] as IBreadCrumb[]) ?? [];
    breadcrumbs = this.addBreadCrumb(items);

    if (route.firstChild) {
      return this.buildBreadCrumb(route.firstChild);
    }

    return breadcrumbs;
  }

  private addBreadCrumb(items: IBreadCrumb[]): IBreadCrumb[] {
    let buildedItems: IBreadCrumb[] = [];

    items.forEach((item: IBreadCrumb) => {
      buildedItems.push(item);
    });

    buildedItems = this.buildLinksBreadCrumb(buildedItems);

    return buildedItems;
  }

  private buildLinksBreadCrumb(buildedItems: IBreadCrumb[]): IBreadCrumb[] {
    const lastItem = buildedItems[buildedItems.length - 1];

    buildedItems.forEach((item: IBreadCrumb) => {
      if (item.text === 'PROJECT-NAME')
        Object.assign(item, {
          link: '/dashboard',
        });
    });
    this.buildRegistrationEdit(lastItem, buildedItems);
    return buildedItems;
  }

  private buildRegistrationEdit(
    lastItem: IBreadCrumb,
    buildedItems: IBreadCrumb[],
  ): void {
    if (
      lastItem?.text === 'COMMONS.REGISTRATION' ||
      lastItem?.text === 'COMMONS.CONSULTATION' ||
      lastItem?.text === 'COMMONS.EDIT'
    ) {
      buildedItems[buildedItems.length - 2].link =
        this.replaceLastPathWithConsulta(this.router.url);
    } else if (buildedItems.length > 0) {
      buildedItems[buildedItems.length - 1].link = this.router.url;
    }
  }

  private replaceLastPathWithConsulta(path: string): string {
    const lastSlashIndex = path.lastIndexOf('/');

    let pathBeforeLastSlash = path.substring(0, lastSlashIndex);

    const parts = path.split('/');

    if (parts.length >= 4 && parts[parts.length - 2] === 'editar') {
      parts.pop();
      parts.pop();
      pathBeforeLastSlash = parts.join('/');
      return `${pathBeforeLastSlash}/consulta`;
    }

    return `${pathBeforeLastSlash}/consulta`;
  }
}
