import { Routes } from '@angular/router';
import { RegistroVentaComponent } from './features/ventas/pages/registro-venta/registro-venta.component';
import { ListadoVentasComponent } from './features/ventas/pages/listado-ventas/listado-ventas.component';

export const routes: Routes = [
  { path: '', redirectTo: 'registro', pathMatch: 'full' },
  { path: 'registro', component: RegistroVentaComponent },
  { path: 'listado', component: ListadoVentasComponent }
];