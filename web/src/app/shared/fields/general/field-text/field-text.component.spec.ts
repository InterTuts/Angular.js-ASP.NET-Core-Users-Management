import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldTextComponent } from './field-text.component';

describe('FieldTextComponent', () => {
  let component: FieldTextComponent;
  let fixture: ComponentFixture<FieldTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldTextComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FieldTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
