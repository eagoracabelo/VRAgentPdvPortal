import { TestBed } from '@angular/core/testing';
import { VrcNotificationService } from './vrc-notification.service';

describe('NotificationService', () => {
  let service: VrcNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VrcNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('success', () => {
    it('should call success notification with default timeout', () => {
      service.success('teste');
      expect(service.notifications).toHaveSize(1);
    });

    it('should call success notification with timeout', () => {
      service.success('teste', 1);
      expect(service.notifications).toHaveSize(1);
    });

    it('should call fixed success notification', () => {
      service.success('teste', 0);
      expect(service.notifications).toHaveSize(1);
    });

    it('should call success notification with exibirMensagemNotificacao false', () => {
      service.successNotify({
        title: 'teste',
        message: 'teste',
        exibirMensagemNotificacao: false,
      });

      expect(service.notifications).toHaveSize(1);
    });
  });

  describe('info', () => {
    it('should call info notification with default timeout', () => {
      service.info('teste');
      expect(service.notifications).toHaveSize(1);
    });
  });

  describe('warning', () => {
    it('should call warning notification with default timeout', () => {
      service.warning('teste');
      expect(service.notifications).toHaveSize(1);
    });
  });

  describe('danger', () => {
    it('should call danger notification with default timeout', () => {
      service.danger('teste');
      expect(service.notifications).toHaveSize(1);
    });
  });

  describe('successNotify', () => {
    it('should call success notification with default timeout', () => {
      service.successNotify({ title: 'teste', message: 'teste' });
      expect(service.notifications).toHaveSize(1);
    });

    it('should call success notification with timeout', () => {
      service.successNotify({ title: 'teste', message: 'teste' }, 1);
      expect(service.notifications).toHaveSize(1);
    });
  });

  describe('infoNotify', () => {
    it('should call info notification with default timeout', () => {
      service.infoNotify({ title: 'teste', message: 'teste' });
      expect(service.notifications).toHaveSize(1);
    });
  });

  describe('warningNotify', () => {
    it('should call warning notification with default timeout', () => {
      service.warningNotify({ title: 'teste', message: 'teste' });
      expect(service.notifications).toHaveSize(1);
    });
  });

  describe('dangerNotify', () => {
    it('should call danger notification with default timeout', () => {
      service.dangerNotify({ title: 'teste', message: 'teste' });
      expect(service.notifications).toHaveSize(1);
    });
  });

  describe('clearAllNotifications', () => {
    it('should clear all notification', () => {
      service.success('teste');
      service.clearAllNotifications();
      expect(service.notifications).toHaveSize(0);
    });

    it('should not clear notification', () => {
      service.clearNotification('bla bla bla', 'bla bla bla');
      expect(service.notifications).toHaveSize(0);
    });
  });
});
