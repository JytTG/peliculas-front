import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pelicula } from '../../shared/models/pelicula.model';
import { PeliculaCreate } from '../../shared/models/pelicula-create.model';
import { PeliculaUpdate } from '../../shared/models/pelicula-update.model';

@Injectable({
  providedIn: 'root'
})
export class PeliculaService {
  private readonly apiUrl = 'https://localhost:7147/api/Peliculas';

  constructor(private http: HttpClient) {}

  getPeliculas(): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(`${this.apiUrl}?t=${new Date().getTime()}`);
  }

  getPeliculaById(id: number): Observable<Pelicula> {
    return this.http.get<Pelicula>(`${this.apiUrl}/${id}?t=${new Date().getTime()}`);
  }

  crearPelicula(data: PeliculaCreate): Observable<Pelicula> {
    return this.http.post<Pelicula>(this.apiUrl, data);
  }

  actualizarPelicula(id: number, data: PeliculaUpdate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  eliminarPelicula(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}