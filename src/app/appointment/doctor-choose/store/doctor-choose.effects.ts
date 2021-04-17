import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap} from 'rxjs/operators';
import * as DoctorActions from './doctor-choose.actions';
import {DoctorChoose} from '../../models/doctor-choose.model';
import {NetworkService} from '../../../shared/services/network.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {of} from 'rxjs';

@Injectable()
export class DoctorEffects {
  @Effect()
  fetchAdmins = this.actions$.pipe(
    ofType(DoctorActions.FETCH_DOCTORS),
    switchMap(() => {
      return this.http.get<DoctorChoose[]>(this.networkClient.getBaseUrl() + 'doctors/');
    }),
    map(doctorResponse => {
      return new DoctorActions.SetDoctorSuccess(doctorResponse);
    }),
    catchError((error: HttpErrorResponse) => {
      return handleError(error);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private networkClient: NetworkService,
  ) {
  }
}

const handleError = (error: HttpErrorResponse) => {
  const errorMessage = error.error.message;
  return of(new DoctorActions.SetDoctorFailed(errorMessage));
};
