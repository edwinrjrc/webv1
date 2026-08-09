import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ServiciosBusquedaService,
  BusquedaTourRequest,
} from '../../_services/servicios-busqueda.service';

@Component({
  selector: 'app-resultado-tours',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultado-tours.component.html',
  styleUrl: './resultado-tours.component.css',
})
export class ResultadoToursComponent implements OnInit {
  resultados: any[] = [];
  cargando = true;
  sinResultados = false;
  error = false;
  parametros: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviciosBusquedaService: ServiciosBusquedaService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.parametros = params;
      this.buscar(params as BusquedaTourRequest);
    });
  }

  buscar(params: BusquedaTourRequest): void {
    this.cargando = true;
    this.error = false;
    this.sinResultados = false;

    this.serviciosBusquedaService.buscarTours(params).subscribe({
      next: (resp) => {
        this.resultados = resp?.data ?? resp ?? [];
        this.sinResultados = this.resultados.length === 0;
        this.cargando = false;
      },
      error: () => {
        this.error = true;
        this.cargando = false;
      },
    });
  }

  volver(): void {
    this.router.navigate(['/busqueda']);
  }
}
