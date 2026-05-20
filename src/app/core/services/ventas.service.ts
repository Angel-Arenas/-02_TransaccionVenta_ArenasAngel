import { Injectable } from '@angular/core';
import { Cliente, Producto, Venta } from '../../shared/interfaces/venta.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  // --- DATOS EN MEMORIA ---
  private clientesMock: Cliente[] = [
    { id: 1, nombre: 'Juan Pérez' },
    { id: 2, nombre: 'María Gómez' },
    { id: 3, nombre: 'Carlos Ruiz' }
  ];

  private productosMock: Producto[] = [
    { id: 1, nombre: 'Laptop ASUS', precio: 1500, stock: 10 },
    { id: 2, nombre: 'Mouse Inalámbrico', precio: 25, stock: 50 },
    { id: 3, nombre: 'Teclado Mecánico', precio: 80, stock: 15 },
    { id: 4, nombre: 'Monitor 24"', precio: 200, stock: 8 }
  ];

  private ventasRegistradas: Venta[] = [];

  constructor() { }

  // --- MÉTODOS SIMULADOS (MOCKS) ---
  obtenerClientes(): Observable<Cliente[]> {
    return of(this.clientesMock); // 'of' simula la respuesta asíncrona de una API
  }

  obtenerProductos(): Observable<Producto[]> {
    return of(this.productosMock);
  }

  obtenerVentas(): Observable<Venta[]> {
    return of(this.ventasRegistradas);
  }

  registrarVenta(venta: Venta): Observable<{ success: boolean, message: string }> {
    // 1. Validar que la venta no esté vacía
    if (!venta.detalles || venta.detalles.length === 0) {
      return of({ success: false, message: 'La venta debe tener al menos un producto.' });
    }

    // 2. Simular validación de stock y actualizarlo
    for (const detalle of venta.detalles) {
      const productoDb = this.productosMock.find(p => p.id === detalle.productoId);
      if (!productoDb || productoDb.stock < detalle.cantidad) {
        return of({ success: false, message: `Stock insuficiente para ${detalle.productoNombre}` });
      }
      // Restar stock
      productoDb.stock -= detalle.cantidad;
    }

    // 3. Asignar ID simulado, fecha y guardar
    venta.id = new Date().getTime(); 
    venta.fecha = new Date();
    this.ventasRegistradas.push(venta);

    return of({ success: true, message: 'Venta registrada con éxito' });
  }
}