import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Habitacion } from '../model/habitacion';
import { GenericSignalService } from './generic-signal.service';

@Injectable({ providedIn: 'root' })
export class HabitacionService extends GenericSignalService<Habitacion> {
    protected override url: string = `${environment.HOST}/api/habitaciones`;
}