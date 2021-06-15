import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
  
}
