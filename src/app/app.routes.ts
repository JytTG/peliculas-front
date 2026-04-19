import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Registro } from './features/auth/registro/registro';
import { DashboardComponent } from './features/dashboard/dashboard';
import { ListadoCategorias } from './features/categorias/listado-categorias/listado-categorias';
import { CrearCategoria } from './features/categorias/crear-categoria/crear-categoria';
import { EditarCategoria } from './features/categorias/editar-categoria/editar-categoria';
import { ListadoPeliculas } from './features/peliculas/listado-peliculas/listado-peliculas';
import { CrearPelicula } from './features/peliculas/crear-pelicula/crear-pelicula';
import { EditarPelicula } from './features/peliculas/editar-pelicula/editar-pelicula';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'categorias', component: ListadoCategorias, canActivate: [authGuard] },
  { path: 'categorias/crear', component: CrearCategoria, canActivate: [authGuard] },
  { path: 'categorias/editar/:id', component: EditarCategoria, canActivate: [authGuard] },
  { path: 'peliculas', component: ListadoPeliculas, canActivate: [authGuard] },
  { path: 'peliculas/crear', component: CrearPelicula, canActivate: [authGuard] },
  { path: 'peliculas/editar/:id', component: EditarPelicula, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];