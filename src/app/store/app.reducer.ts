import { ActionReducerMap } from '@ngrx/store';

import * as fromDoctors from '../appointment/doctor-choose/store/doctor-choose.reducer';

export interface AppState {
  doctors: fromDoctors.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  doctors: fromDoctors.doctorReducer
};
