import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangerequestsComponent } from './exchangerequests.component';

describe('ExchangerequestsComponent', () => {
  let component: ExchangerequestsComponent;
  let fixture: ComponentFixture<ExchangerequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExchangerequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExchangerequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
