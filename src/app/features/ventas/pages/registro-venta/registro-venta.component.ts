import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { VentasService } from '../../../../core/services/ventas.service';
import { Cliente, Producto, Venta } from '../../../../shared/interfaces/venta.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro-venta',
  standalone: true, // <-- Asegúrate de que esto esté
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-venta.component.html',
  styleUrls: ['./registro-venta.component.css']
})
export class RegistroVentaComponent implements OnInit {
  ventaForm!: FormGroup;
  clientes: Cliente[] = [];
  productos: Producto[] = [];
  totalGeneral = 0;

  constructor(private fb: FormBuilder, private ventasService: VentasService) {
    this.initForm();
  }

  ngOnInit(): void {
    this.ventasService.obtenerClientes().subscribe(data => this.clientes = data);
    this.ventasService.obtenerProductos().subscribe(data => this.productos = data);
  }

  initForm() {
    this.ventaForm = this.fb.group({
      clienteId: [null, Validators.required],
      detalles: this.fb.array([]) // Aquí irán los productos dinámicos
    });
  }

  get detalles() {
    return this.ventaForm.get('detalles') as FormArray;
  }

  agregarProducto() {
    const detalleForm = this.fb.group({
      productoId: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precio: [{ value: 0, disabled: true }],
      subtotal: [{ value: 0, disabled: true }]
    });
    this.detalles.push(detalleForm);
  }

  removerProducto(index: number) {
    this.detalles.removeAt(index);
    this.calcularTotal();
  }

  onProductoChange(index: number) {
    const detailRow = this.detalles.at(index);
    const prodId = detailRow.get('productoId')?.value;
    const productoSelected = this.productos.find(p => p.id === +prodId);

    if (productoSelected) {
      detailRow.patchValue({ precio: productoSelected.precio });
      this.actualizarSubtotal(index);
    }
  }

  actualizarSubtotal(index: number) {
    const row = this.detalles.at(index);
    const sub = row.get('cantidad')?.value * row.get('precio')?.value;
    row.get('subtotal')?.patchValue(sub);
    this.calcularTotal();
  }

  calcularTotal() {
    this.totalGeneral = this.detalles.controls
      .map(row => row.get('subtotal')?.value || 0)
      .reduce((acc, val) => acc + val, 0);
  }

  guardarVenta() {
    if (this.ventaForm.invalid) return alert('Por favor complete todos los campos obligatorios');

    // 1. Obtenemos todos los valores del formulario
    const rawValues = this.ventaForm.getRawValue();

    // 2. Buscamos el nombre del cliente (y nos aseguramos de que el ID sea número)
    const clienteIdNum = Number(rawValues.clienteId);
    const clienteObj = this.clientes.find(c => c.id === clienteIdNum);
    const clientName = clienteObj ? clienteObj.nombre : '';
    
    // 3. Mapeamos los detalles para convertir el ID a número y agregar el nombre del producto
    const detallesCorregidos = rawValues.detalles.map((detalle: any) => {
      const prodIdNum = Number(detalle.productoId); // Transformar de string a number
      const productoEncontrado = this.productos.find(p => p.id === prodIdNum);
      
      return {
        ...detalle,
        productoId: prodIdNum,
        productoNombre: productoEncontrado ? productoEncontrado.nombre : 'Producto Desconocido'
      };
    });

    const payload: Venta = {
      clienteId: clienteIdNum,
      clienteNombre: clientName,
      fecha: new Date(), // <-- ¡Agregamos la fecha aquí!
      detalles: detallesCorregidos,
      total: this.totalGeneral
    };

    // 5. Enviamos la transacción al servicio
    this.ventasService.registrarVenta(payload).subscribe(res => {
      alert(res.message);
      if (res.success) {
        this.initForm(); // Limpiamos el formulario
        this.totalGeneral = 0; // Reiniciamos el total visual a cero
      }
    });
  }
}

