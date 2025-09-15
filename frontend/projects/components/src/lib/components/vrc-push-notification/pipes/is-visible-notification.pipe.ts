import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'isVisible', pure: false })
export class VisibleNotificationPipe implements PipeTransform {
  transform(notifications: unknown[]): string {
    return notifications?.length > 0 ? 'open' : 'closed';
  }
}
