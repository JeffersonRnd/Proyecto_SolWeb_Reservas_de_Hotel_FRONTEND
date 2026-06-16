import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Huesped } from '../model/huesped';
import { GenericSignalService } from './generic-signal.service';

@Injectable({ providedIn: 'root' })
export class HuespedService extends GenericSignalService<Huesped> {
    protected override url: string = `${environment.HOST}/api/huespedes`;

    /** Devuelve el huésped asociado al usuario autenticado (rol ADMIN o HUESPED). */
    findMe() {
        return this.http.get<Huesped>(`${this.url}/me`);
    }
}