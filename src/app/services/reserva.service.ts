import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Reserva } from '../model/reserva';
import { GenericSignalService } from './generic-signal.service';

@Injectable({ providedIn: 'root' })
export class ReservaService extends GenericSignalService<Reserva> {
    protected override url: string = `${environment.HOST}/api/reservas`;

    override findAll() {
        return this.http.get<any>(this.url).pipe(
            map(res => (res?._embedded?.reservaResponseDTOList ?? res ?? []) as Reserva[])
        );
    }
}