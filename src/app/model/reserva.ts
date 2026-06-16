import { DetalleReserva } from './detalle-reserva';

export class Reserva {
    id: number;
    huespedNombre: string;
    huespedDni: string;
    fechaIngreso: string;
    fechaSalida: string;
    totalPagar: number;
    estado: string;
    observaciones: string;
    detalles: DetalleReserva[];
}