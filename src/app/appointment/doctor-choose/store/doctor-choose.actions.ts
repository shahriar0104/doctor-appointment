import {Action} from '@ngrx/store';
import {DoctorChoose} from '../../models/doctor-choose.model';

export const SET_DOCTOR_SUCCESS = '[Doctor] Set Doctor Success';
export const SET_DOCTOR_FAILED = '[Doctor] Set Doctor Failed';
export const FETCH_DOCTORS = '[Doctor] Fetch Doctors';

export class SetDoctorSuccess implements Action {
  readonly type = SET_DOCTOR_SUCCESS;

  constructor(public payload: DoctorChoose[]) {
  }
}

export class SetDoctorFailed implements Action {
  readonly type = SET_DOCTOR_FAILED;

  constructor(public payload: string) {
  }
}

export class FetchDoctors implements Action {
  readonly type = FETCH_DOCTORS;
}

export type DoctorActions =
  | SetDoctorSuccess
  | SetDoctorFailed
  | FetchDoctors;
