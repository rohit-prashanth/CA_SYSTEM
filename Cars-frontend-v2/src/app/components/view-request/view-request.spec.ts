import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRequest } from './view-request';

describe('ViewRequest', () => {
  let component: ViewRequest;
  let fixture: ComponentFixture<ViewRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
