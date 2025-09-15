import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { VrcNotificationService } from '../../services/vrc-notification.service';
import { VisibleNotificationPipe } from './pipes/is-visible-notification.pipe';
import { VrcPushNotificationComponent } from './vrc-push-notification.component';

describe('VrcPushNotificationComponent', () => {
  let component: VrcPushNotificationComponent;
  let fixture: ComponentFixture<VrcPushNotificationComponent>;
  let service: VrcNotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VrcPushNotificationComponent, VisibleNotificationPipe],
      imports: [NoopAnimationsModule],
    }).compileComponents();

    service = TestBed.inject(VrcNotificationService);
    fixture = TestBed.createComponent(VrcPushNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const pushNotificationComponent: any = component;
    expect(pushNotificationComponent).toBeTruthy();
  });

  describe('notificationsArray, toats and notifications', () => {
    it('should get itens from service', () => {
      service.notifications.set('teste', { isNotify: false } as any);
      service.notifications.set('teste 2', { isNotify: true } as any);

      expect(component.notifications).toHaveSize(2);
    });
  });

  describe('clearNotification', () => {
    it('should call service with confirm = false', () => {
      const spy = spyOn(service, 'clearNotification');

      component.clearNotification('teste', 'teste');
      expect(spy).toHaveBeenCalledWith('teste', 'teste', false);
    });

    it('should call service with confirm = true', () => {
      const spy = spyOn(service, 'clearNotification');

      component.clearNotification('teste', 'teste', true);
      expect(spy).toHaveBeenCalledWith('teste', 'teste', true);
    });
  });

  describe('freezeNotification', () => {
    it('should freeze notification', () => {
      const notification = {
        timeout: setTimeout(() => {}),
        expirationTime: Date.now() + 1000,
      } as any;
      component.freezeNotification(notification);
      expect(notification.remainingTime).toBeDefined();
    });

    it('should not freeze notification', () => {
      const notification = {
        time: 0,
        timeout: setTimeout(() => {}),
        expirationTime: Date.now() + 1000,
      } as any;
      component.freezeNotification(notification);
      expect(notification.remainingTime).toBeUndefined();
    });
  });

  describe('unFreezeNotification', () => {
    it('should unfreeze notification', () => {
      const spy = spyOn(service, 'setTimer');

      const notification = {
        message: 'teste',
        remainingTime: 1000,
      } as any;
      component.unFreezeNotification(notification);

      expect(spy).toHaveBeenCalled();
    });

    it('should unfreeze notification', () => {
      const spy = spyOn(service, 'setTimer');

      const notification = {
        time: 0,
        message: 'teste',
        remainingTime: 1000,
      } as any;
      component.unFreezeNotification(notification);

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
