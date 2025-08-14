import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsectionDetail } from './subsection-detail';

describe('SubsectionDetail', () => {
  let component: SubsectionDetail;
  let fixture: ComponentFixture<SubsectionDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubsectionDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubsectionDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
