import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DatosPasajero } from '../../modelo/datospasajero';

@Component({
  selector: 'app-datospasajero',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './datospasajero.component.html',
  styleUrl: './datospasajero.component.css'
})
export class DatosPasajeroComponent implements OnInit  {
  @Input() tipoPasajero!: String;

  datosPasajero!: DatosPasajero;
  nombrePasajero!: string;

  constructor(){
    this.datosPasajero = new DatosPasajero();
  }

  ngOnInit(): void {

  }
}
