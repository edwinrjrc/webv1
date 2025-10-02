import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatostransferenciaComponent } from './datostransferencia.component';

describe('DatostransferenciaComponent', () => {
  let component: DatostransferenciaComponent;
  let fixture: ComponentFixture<DatostransferenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatostransferenciaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatostransferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
