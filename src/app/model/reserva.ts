import { Huesped } from './huesped';
import { DetalleReserva } from './detalle-reserva';

export class Reserva {
    id: number;
    huesped: Huesped;
    fechaIngreso: string;
    fechaSalida: string;
    totalPagar: number;
    estado: string;
    observaciones: string;
    detalles: DetalleReserva[];
}