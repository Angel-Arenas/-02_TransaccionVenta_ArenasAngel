export interface Cliente {
  id: number;
  nombre: string;
}

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

export interface DetalleVenta {
  productoId: number;
  productoNombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;
}

export interface Venta {
  id?: number;
  clienteId: number;
  clienteNombre: string;
  fecha: Date;
  total: number;
  detalles: DetalleVenta[];
}