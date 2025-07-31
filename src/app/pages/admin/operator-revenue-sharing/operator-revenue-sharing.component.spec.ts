import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorRevenueSharingComponent } from './operator-revenue-sharing.component';

describe('OperatorRevenueSharingComponent', () => {
  let component: OperatorRevenueSharingComponent;
  let fixture: ComponentFixture<OperatorRevenueSharingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperatorRevenueSharingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperatorRevenueSharingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
