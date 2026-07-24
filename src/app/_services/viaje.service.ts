import { Injectable } from '@angular/core';
import { ConsultaViaje } from '../modelo/consultaViaje';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RptaVuelosEncontrados } from '../modelo/dataRptaVuelos';
import { UtilconversionsService } from './utilconversions.service';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {

  constructor(protected http: HttpClient, private _utilconversionsService: UtilconversionsService) { }

  async consultarVuelo(consultaViaje: ConsultaViaje){
    const url = `${environment.apiUrl}/api/viajes/viajeService/vuelosCotizacion`;

    let consultaViajeWeb: ConsultaViaje = new ConsultaViaje();
    consultaViajeWeb = Object.assign(consultaViajeWeb, consultaViaje);
    consultaViajeWeb.Adultos = await this._utilconversionsService.encryptData(consultaViaje.Adultos);
    consultaViajeWeb.CodigoIataDestino = await this._utilconversionsService.encryptData(consultaViaje.CodigoIataDestino);
    consultaViajeWeb.CodigoIataOrigen = await this._utilconversionsService.encryptData(consultaViaje.CodigoIataOrigen);
    consultaViajeWeb.ClaseVuelo = await this._utilconversionsService.encryptData(consultaViaje.ClaseVuelo);
    consultaViajeWeb.FechaIdaStr = await this._utilconversionsService.encryptData(consultaViaje.FechaIdaStr);
    consultaViajeWeb.FechaVueltaStr = await this._utilconversionsService.encryptData(consultaViaje.FechaVueltaStr);
    consultaViajeWeb.Infantes = await this._utilconversionsService.encryptData(consultaViaje.Infantes);
    consultaViajeWeb.Ninos = await this._utilconversionsService.encryptData(consultaViaje.Ninos);
    consultaViajeWeb.TipoViaje = await this._utilconversionsService.encryptData(consultaViaje.TipoViaje);

    /*let cabece = new HttpHeaders();
    cabece.set('Content-Type', 'application/json; charset=utf-8');

    let params = new HttpParams();
    params = params.set('param1', consultaViaje.TipoViaje);
    params = params.append('param2', consultaViaje.CodigoIataOrigen);
    params = params.append('param3', consultaViaje.CodigoIataDestino);
    params = params.append('param4', consultaViaje.ClaseVuelo);
    params = params.append('param5', consultaViaje.FechaIdaStr);
    params = params.append('param6', consultaViaje.FechaVueltaStr);
    params = params.append('param7', consultaViaje.Adultos);
    params = params.append('param8', consultaViaje.Ninos);
    params = params.append('param9', consultaViaje.Infantes);*/

    //const servicio = this.http.post<RptaVuelosEncontrados>(url, {headers : cabece, observe: 'body', params:params } );

    return this.http.post<RptaVuelosEncontrados>(url, consultaViajeWeb);
    
    //return servicio;
  }

}
