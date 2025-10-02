import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatostarjetaComponent } from './datostarjeta.component';

describe('DatostarjetaComponent', () => {
  let component: DatostarjetaComponent;
  let fixture: ComponentFixture<DatostarjetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatostarjetaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatostarjetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
