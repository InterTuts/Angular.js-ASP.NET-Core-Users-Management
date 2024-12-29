import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldPasswordComponent } from './field-password.component';

describe('FieldPasswordComponent', () => {
  let component: FieldPasswordComponent;
  let fixture: ComponentFixture<FieldPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FieldPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
