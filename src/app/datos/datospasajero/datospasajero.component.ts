import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-datospasajero',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './datospasajero.component.html',
  styleUrl: './datospasajero.component.css'
})
export class DatosPasajeroComponent {
  // Asegúrate de que estos Inputs existan con estos nombres exactos:
  @Input() tipoPasajero: string = '';
  @Input() numeroPasajero: number = 0;
  @Input() totalPasajeros: number = 0;
  @Input() pasajeroForm!: FormGroup;

  tp_Adulto: string = 'A';

  // Variables para el HTML
  varFormNombres = 'primerNombre';
  varFormprimerApellido = 'primerApellido';
  varFormsegundoApellido = 'segundoApellido';
  varFormfechaNacimiento = 'fechaNacimiento';
  varFormtipoSexo = 'tipoSexo';
  varFormtipoDocumento = 'tipoDocumento';
  varFormnumeroDocumento = 'numeroDocumento';
  varFormFechaExpiraDoc = 'fechaExpiracionDoc';
  varFormNacionalidad = 'nacionalidad';
  varFormAsistencia = 'requiereAsistencia';
  varFormRespAdulto = 'responsableAdulto';
  varFormemailContacto = 'correoElectronico';
  varFormnumTelefonoContacto = 'numTelefonoContacto';
}