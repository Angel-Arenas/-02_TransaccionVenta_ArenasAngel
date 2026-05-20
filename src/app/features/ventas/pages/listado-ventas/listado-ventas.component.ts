import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para el filtro de búsqueda
import { VentasService } from '../../../../core/services/ventas.service';
import { Venta } from '../../../../shared/interfaces/venta.interface';

@Component({
  selector: 'app-listado-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listado-ventas.component.html',
  styleUrls: ['./listado-ventas.component.css']
})
export class ListadoVentasComponent implements OnInit {
  ventas: Venta[] = [];
  filtroCliente: string = '';

  constructor(private ventasService: VentasService) {}

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas() {
    this.ventasService.obtenerVentas().subscribe(data => {
      this.ventas = data;
    });
  }

  // Lógica de filtrado por nombre de cliente
  get ventasFiltradas() {
    return this.ventas.filter(v => 
      v.clienteNombre.toLowerCase().includes(this.filtroCliente.toLowerCase())
    );
  }

  // Método para calcular la cantidad de productos por venta
  obtenerTotalProductos(venta: Venta): number {
    return venta.detalles.reduce((acc, item) => acc + item.cantidad, 0);
  }
}