import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { iconsEnumToArray } from '../enums/icons.enum';

@Component({
  selector: 'vr-design-guide-icones',
  templateUrl: './design-guide-icones.component.html',
  styleUrls: ['./design-guide-icones.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DesignGuideIconesComponent implements OnDestroy {
  icons = iconsEnumToArray();

  sidebarControl(iconElement: Element): void {
    this.cloneIconForSadebarControl(iconElement);
    this.openSidebarControl();
  }

  private cloneIconForSadebarControl(iconElement: Element): void {
    const iconName = this.getIconName(iconElement);

    this.setAttributeForDownload(iconName);

    const controlSidebarIcon = document.querySelector(
      'div.control-sidebar-preview-icon',
    );
    const controlSidebarCodeIcon = document.querySelector(
      'div.control-sidebar-code-icon > pre > code',
    );
    if (controlSidebarIcon) {
      controlSidebarIcon.innerHTML = iconElement.outerHTML;
    }
    if (controlSidebarCodeIcon) {
      controlSidebarCodeIcon.textContent = iconElement.outerHTML?.replace(
        `ng-reflect-ng-class="vr-${iconName}"`,
        '',
      );
    }
  }

  private getIconName(iconElement: Element): string {
    const iconName = iconElement.className?.replace('vr vr-', '');
    return iconName;
  }

  private setAttributeForDownload(iconName: string): void {
    const controlSidebarDownloadIcon = document.querySelector(
      'div.control-sidebar-download-icon',
    )?.lastElementChild;
    controlSidebarDownloadIcon?.setAttribute(
      'href',
      `/assets/icons/svg/${iconName}.svg`,
    );
  }

  openSidebarControl(): void {
    const controlSidebar = document.querySelector('aside.control-sidebar');
    const hasClassSidebarOpen =
      controlSidebar?.classList.contains('control-sidebar-open') ?? false;
    if (!hasClassSidebarOpen) {
      controlSidebar?.classList.add('control-sidebar-open');
    }
  }

  closeSidebarControl(): void {
    const controlSidebar = document.querySelector('aside.control-sidebar');
    const hasClassSidebarOpen =
      controlSidebar?.classList.contains('control-sidebar-open') ?? false;
    if (hasClassSidebarOpen) {
      controlSidebar?.classList.remove('control-sidebar-open');
    }
  }

  getDescriptionIcon(icon: string): string {
    return icon?.replace('vr-', '');
  }

  copyToClipboard(icon: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = this.getDescriptionIcon(icon);
    document.body.appendChild(textarea);

    textarea.select();
    document.execCommand('copy');

    document.body.removeChild(textarea);
  }

  ngOnDestroy(): void {
    this.closeSidebarControl();
  }
}
