import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DirNumerosDirective } from '../../dir-numeros.directive';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ValidacionesPropias } from '../../validaciones/validacionespropias';

@Component({
  selector: 'app-datostarjeta',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './datostarjeta.component.html',
  styleUrl: './datostarjeta.component.css',
})
export class DatostarjetaComponent implements OnInit {
  datosTarjetaForm!: FormGroup;

  varFormNumTarjeta = 'numeroTarjeta';
  varFormVctoTarjeta = 'vctoTarjeta';

  @Output() formSubmit = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {}


  ngOnInit(): void {
    this.datosTarjetaForm = this.fb.group({
      numeroTarjeta: ['', [Validators.required]],
      vctoTarjeta: new FormControl('', [Validators.required]),
      codigoSeguridadTarjeta: new FormControl('', [Validators.required]),
      codigoTipoDocumentoTitular: new FormControl(0, [
        Validators.required,
        ValidacionesPropias.notZero(),
      ]),
      numeroDocumentoTitular: new FormControl('', [Validators.required]),
      nombreTitular: new FormControl('', [Validators.required])
    });
    //throw new Error('Method not implemented.');
  }

  isRequired(controlName: string): boolean {
      const control = this.datosTarjetaForm.get(controlName);
      if (!control) {
        return false;
      }
      if (control.validator) {
        const validator = control.validator({} as AbstractControl);
        return validator && validator['required'];
      }
      return false;
    }
  
    getFormData() {
      return this.datosTarjetaForm.value;
    }


}
