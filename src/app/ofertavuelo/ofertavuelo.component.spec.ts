import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertavueloComponent } from './ofertavuelo.component';

describe('OfertavueloComponent', () => {
  let component: OfertavueloComponent;
  let fixture: ComponentFixture<OfertavueloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfertavueloComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OfertavueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
