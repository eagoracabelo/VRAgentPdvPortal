import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[vrMenuBreak]',
})
export class MenuBreakDirective {
  private listEventsToRemove: HTMLElement[] = [];

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const childNodes = target.childNodes;
    this.checkMenuToSubMenu(childNodes);
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent): void {
    this.removeEvents();
    const target = event.target as HTMLElement;
    const childNodes = target.childNodes;
    this.checkMenuToSubMenu(childNodes, true);
  }

  private removeEvents(): void {
    this.listEventsToRemove.forEach((menuItem) => {
      menuItem.removeEventListener('mouseenter', this.eventListenerMouseEnter);
      menuItem.removeEventListener('mouseleave', this.eventListenerMouseLeave);
    });
    this.listEventsToRemove = [];
  }

  private checkMenuToSubMenu(
    childNodes: NodeListOf<ChildNode>,
    removeStyle = false,
  ): void {
    for (const node of Array.from(childNodes)) {
      const element = node as HTMLElement;
      if (element.classList?.contains('main-sidebar__submenu--container')) {
        const subMenu = element.childNodes;
        if (removeStyle) {
          this.removeAddMarginTopStyle(subMenu);
          return;
        }

        this.checkSubMenuByMenu(subMenu);
      }
    }
  }

  private checkSubMenuByMenu(childNodes: NodeListOf<ChildNode>): void {
    for (const node of Array.from(childNodes)) {
      const element = node as HTMLElement;
      if (element.classList?.contains('main-sidebar__submenu')) {
        const parentHeight = element.parentElement?.offsetHeight ?? 48;

        const subMenuRect = element.getBoundingClientRect();
        const subMenuBottom = subMenuRect.bottom;
        const subMenuHeight = subMenuRect.height;
        const windowHeight = window.innerHeight;

        if (subMenuBottom > windowHeight) {
          const topPositon = -Math.abs((subMenuHeight - parentHeight) / 16);
          element.style.marginTop = `${topPositon}rem`;
        }

        this.checkSubMenuItem(element.childNodes);

        break;
      }
    }
  }

  private checkSubMenuItem(childNodes: NodeListOf<ChildNode>): void {
    for (const node of Array.from(childNodes)) {
      const element = node as HTMLElement;
      if (element.classList?.contains('main-sidebar__submenu-item')) {
        this.addEventToSubMenuItem(element);
      }
    }
  }

  private checkSubMenuBySubMenu(
    childNodes: NodeListOf<ChildNode>,
    parent: HTMLElement,
  ): void {
    for (const node of Array.from(childNodes)) {
      const element = node as HTMLElement;
      if (element.classList?.contains('main-sidebar__submenu')) {
        const subMenuRect = element.getBoundingClientRect();
        const subMenuBottom = subMenuRect.bottom;
        const subMenuHeight = subMenuRect.height;
        const windowHeight = window.innerHeight;

        if (subMenuBottom > windowHeight) {
          const parentHeight = parent.offsetHeight;
          const topPositon = -Math.abs((subMenuHeight - parentHeight) / 16);
          element.style.marginTop = `${topPositon}rem`;
        }

        break;
      }
    }
  }

  private eventListenerMouseEnter = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    const childNodes = target.childNodes;
    this.checkSubMenuBySubMenu(childNodes, target);
  };

  private eventListenerMouseLeave = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    const childNodes = target.childNodes;
    this.removeAddMarginTopStyle(childNodes);
  };

  private addEventToSubMenuItem(menuItem: HTMLElement): void {
    menuItem.addEventListener('mouseenter', this.eventListenerMouseEnter);
    menuItem.addEventListener('mouseleave', this.eventListenerMouseLeave);
    this.listEventsToRemove.push(menuItem);
  }

  private removeAddMarginTopStyle(childNodes: NodeListOf<ChildNode>): void {
    for (const node of Array.from(childNodes)) {
      const element = node as HTMLElement;

      if (
        element.classList?.contains('main-sidebar__submenu') &&
        element.style.marginTop
      ) {
        element.style.removeProperty('margin-top');
        break;
      }
    }
  }
}
