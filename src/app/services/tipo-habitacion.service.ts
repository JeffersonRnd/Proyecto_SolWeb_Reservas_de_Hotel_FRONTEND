import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { TipoHabitacion } from '../model/tipo-habitacion';
import { GenericSignalService } from './generic-signal.service';

@Injectable({ providedIn: 'root' })
export class TipoHabitacionService extends GenericSignalService<TipoHabitacion> {
    protected override url: string = `${environment.HOST}/api/tipos-habitacion`;
}