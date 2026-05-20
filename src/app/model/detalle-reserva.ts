import { Habitacion } from './habitacion';

export class DetalleReserva {
    id: number;
    habitacion: Habitacion;
    cantidadNoches: number;
    precioUnitario: number;
    subtotal: number;
}