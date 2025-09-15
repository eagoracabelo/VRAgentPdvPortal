import { TestBed } from '@angular/core/testing';
import { TemplateRef } from '@angular/core';
import { DatatableRowAddTemplateDirective } from './row-add-template.directive';

describe('DatatableRowAddTemplateDirective', () => {
  let directive: DatatableRowAddTemplateDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatatableRowAddTemplateDirective, TemplateRef],
    });
    directive = TestBed.inject(DatatableRowAddTemplateDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should have a template', () => {
    expect(directive.template).toBeDefined();
    expect(directive.template instanceof TemplateRef).toBeTruthy();
  });
});
