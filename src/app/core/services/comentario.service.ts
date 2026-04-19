import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comentario } from '../../shared/models/comentario.model';
import { ComentarioCreate } from '../../shared/models/comentario-create.model';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  private readonly apiUrl = 'https://localhost:7147/api/Comentarios';

  constructor(private http: HttpClient) {}

  getComentariosPorPelicula(peliculaId: number): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(`${this.apiUrl}/pelicula/${peliculaId}?t=${new Date().getTime()}`);
  }

  crearComentario(data: ComentarioCreate): Observable<Comentario> {
    return this.http.post<Comentario>(this.apiUrl, data);
  }
}