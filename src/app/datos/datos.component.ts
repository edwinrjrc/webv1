import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { DatosPasajeroComponent } from './datospasajero/datospasajero.component';
import { MetodopagoComponent } from './metodopago/metodopago.component';
import { ConsultaViaje } from '../modelo/consultaViaje';
import { OfertaSeleccionada } from '../modelo/ofertaSeleccionada'; // Verifica que esta ruta sea correcta
import { UtilconversionsService } from '../_services/utilconversions.service';
import { Constantes } from '../_services/constantes';
import { ValidacionesPropias } from '../validaciones/validacionespropias';

declare var bootstrap: any;

@Component({
  selector: 'app-datos',
  standalone: true,
  imports: [DatosPasajeroComponent, MetodopagoComponent, CommonModule, NgbProgressbarModule, ReactiveFormsModule],
  templateUrl: './datos.component.html',
  styleUrl: './datos.component.css',
})
export class DatosComponent implements OnInit {
  @Input() datosCotizacionVuelo!: ConsultaViaje;
  @Input() ofertaSeleccionada!: OfertaSeleccionada; // Soluciona NG8002

  ventaForm: FormGroup;
  totalPasajeros: number = 0;
  listaPasajeros: any[] = [];

  constructor(private _utilconversionsService: UtilconversionsService, private fb: FormBuilder) {
    this.ventaForm = this.fb.group({
      listaPasajeros: this.fb.array([]),
    });
  }

  async ngOnInit() {
    await this.leeVariablesConsultaVuelo();
    this.generarDatosPasajeros();
  }

  get listaPasajerosArray(): FormArray {
    return this.ventaForm.get('listaPasajeros') as FormArray;
  }

  async leeVariablesConsultaVuelo() {
    const resA = await this._utilconversionsService.decryptData(this.datosCotizacionVuelo.Adultos);
    const resN = await this._utilconversionsService.decryptData(this.datosCotizacionVuelo.Ninos);
    const resI = await this._utilconversionsService.decryptData(this.datosCotizacionVuelo.Infantes);

    // Soluciona TS2365 convirtiendo a Number
    const a = resA ? Number(resA) : 0;
    const n = resN ? Number(resN) : 0;
    const i = resI ? Number(resI) : 0;

    this.totalPasajeros = a + n + i;
    this.listaPasajeros = [];
    
    for (let x = 0; x < a; x++) this.listaPasajeros.push({ tipo: Constantes.TP_ADULTO, numero: x + 1 });
    for (let x = 0; x < n; x++) this.listaPasajeros.push({ tipo: Constantes.TP_NINO, numero: x + 1 });
    for (let x = 0; x < i; x++) this.listaPasajeros.push({ tipo: Constantes.TP_INFANTE, numero: x + 1 });
  }

  crearPasajeroFormGroup(p: any, esPrimero: boolean): FormGroup {
    const config: any = {
      tipoPasajero: [p.tipo],
      nombres: ['', [Validators.required]],
      primerApellido: ['', [Validators.required]],
      segundoApellido: [''],
      tipoDocumento: ['0', [Validators.required, ValidacionesPropias.notZero()]],
      numeroDocumento: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      tipoSexo: ['0', [Validators.required, ValidacionesPropias.notZero()]],
      responsableAdulto: ['0']
    };

    if (esPrimero) {
      config['correoElectronico'] = ['', [Validators.required, Validators.email]];
      config['numTelefonoContacto'] = ['', [Validators.required]];
    }

    return this.fb.group(config);
  }

  generarDatosPasajeros(): void {
    this.listaPasajerosArray.clear();
    this.listaPasajeros.forEach((p, index) => {
      this.listaPasajerosArray.push(this.crearPasajeroFormGroup(p, index === 0));
    });
  }

  guardarDatosVenta() {
    if (this.ventaForm.valid) {
      console.log('Venta lista', this.ventaForm.value);
    } else {
      this.ventaForm.markAllAsTouched();
      this.enfocarPrimerError();
    }
  }

  private enfocarPrimerError() {
    const index = this.listaPasajerosArray.controls.findIndex(c => c.invalid);
    if (index !== -1) {
      const element = document.getElementById(`collapsePasajero${index}`);
      if (element) {
        const bsCollapse = new bootstrap.Collapse(element, { show: true });
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }
}