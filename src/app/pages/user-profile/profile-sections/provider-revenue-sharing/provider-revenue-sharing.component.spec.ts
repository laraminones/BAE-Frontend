import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderRevenueSharingComponent } from './provider-revenue-sharing.component';

describe('ProviderRevenueSharingComponent', () => {
  let component: ProviderRevenueSharingComponent;
  let fixture: ComponentFixture<ProviderRevenueSharingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderRevenueSharingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProviderRevenueSharingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
