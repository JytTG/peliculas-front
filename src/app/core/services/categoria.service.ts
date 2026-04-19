import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../../shared/models/categoria.model';
import { CategoriaCreate } from '../../shared/models/categoria-create.model';
import { CategoriaUpdate } from '../../shared/models/categoria-update.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private readonly apiUrl = 'https://localhost:7147/api/Categorias';

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<Categoria[]> {
    const url = `${this.apiUrl}?t=${new Date().getTime()}`;
    return this.http.get<Categoria[]>(url);
  }

  getCategoriaById(id: number): Observable<Categoria> {
    const url = `${this.apiUrl}/${id}?t=${new Date().getTime()}`;
    return this.http.get<Categoria>(url);
  }

  crearCategoria(data: CategoriaCreate): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, data);
  }

  actualizarCategoria(id: number, data: CategoriaUpdate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  eliminarCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}