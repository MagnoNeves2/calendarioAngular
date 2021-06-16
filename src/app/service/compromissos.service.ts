import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventInput, EventSourceInput } from '@fullcalendar/angular';
import { Compromissos } from '../model/Compromissos';

@Injectable({
  providedIn: 'root'
})
export class CompromissosService {

  constructor(private http: HttpClient) { }

  listaDeCompromissos() {
    return this.http.get('http://localhost:3001/compromissos')
  }

  // criarCompromisso() {
  //   return this.http.post('')
  // }

  criarEventos(): EventSourceInput {
    let lista = [];
    this.listaDeCompromissos().subscribe((resp: Compromissos[]) => {
      resp.forEach((compromisso) => {
        let evento: EventInput = {
          id: compromisso.id.toString(),
          title: compromisso.title,
          start: compromisso.start,
          end: compromisso.end
        }

        lista.push(evento);
      })
    });

    const retorno:EventSourceInput = lista;

    return retorno;
  }
  
}
