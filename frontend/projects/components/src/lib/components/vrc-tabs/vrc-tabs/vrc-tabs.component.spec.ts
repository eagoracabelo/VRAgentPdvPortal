import { QueryList } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VrcTabComponent } from './../vrc-tab/vrc-tab.component';
import { VrcTabsComponent } from './vrc-tabs.component';

describe('VrcTabsComponent', () => {
  let component: VrcTabsComponent;
  let fixture: ComponentFixture<VrcTabsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VrcTabsComponent, VrcTabComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const tab = new VrcTabComponent();
    component.tabs = Object.assign(new QueryList(), {
      first: tab,
      _results: [tab],
    }) as QueryList<VrcTabComponent>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ngAfterContentInit tabs defined', () => {
    component.ngAfterContentInit();
    expect(component.tabs).toBeDefined();
  });

  describe('selectTab', () => {
    it('it should not select tab when tab is disabled', () => {
      const tab1 = new VrcTabComponent();
      const tab2 = new VrcTabComponent();
      tab2.disabled = true;
      component.tabs = Object.assign(new QueryList(), {
        first: tab1,
        last: tab2,
        _results: [tab1, tab2],
      }) as QueryList<VrcTabComponent>;

      component.selectTab(1);
      expect(component.currentIndex).toEqual(0);
    });

    it('it should disable sprevious tabs in linearSteps mode', () => {
      const tab1 = new VrcTabComponent();
      const tab2 = new VrcTabComponent();
      component.tabs = Object.assign(new QueryList(), {
        first: tab1,
        last: tab2,
        _results: [tab1, tab2],
      }) as QueryList<VrcTabComponent>;
      component.linearSteps = true;

      component.selectTab(1);
      expect(component.tabs.first.disabled).toBeTrue();
    });
  });
});
