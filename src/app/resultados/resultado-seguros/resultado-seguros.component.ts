import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ServiciosBusquedaService,
  BusquedaSeguroRequest,
} from '../../_services/servicios-busqueda.service';

@Component({
  selector: 'app-resultado-seguros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultado-seguros.component.html',
  styleUrl: './resultado-seguros.component.css',
})
export class ResultadoSegurosComponent implements OnInit {
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
      this.buscar(params as BusquedaSeguroRequest);
    });
  }

  buscar(params: BusquedaSeguroRequest): void {
    this.cargando = true;
    this.error = false;
    this.sinResultados = false;

    this.serviciosBusquedaService.buscarSeguros(params).subscribe({
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
