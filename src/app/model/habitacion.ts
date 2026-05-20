import { TipoHabitacion } from './tipo-habitacion';

export class Habitacion {
    id: number;
    numero: string;
    tipoHabitacion: TipoHabitacion;
    precioPorNoche: number;
    capacidad: number;
    servicios: string;
    disponible: boolean;
}