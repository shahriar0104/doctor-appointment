import {DoctorChoose} from '../../models/doctor-choose.model';
import * as DoctorActions from './doctor-choose.actions';

export interface State {
  doctors: DoctorChoose[];
  doctorError: string;
  loading: boolean;
}

const initialState: State = {
  doctors: [],
  doctorError: null,
  loading: false
};

// tslint:disable-next-line:typedef
export function doctorReducer(
  state: State = initialState,
  action: DoctorActions.DoctorActions
) {
  switch (action.type) {
    case DoctorActions.SET_DOCTOR_SUCCESS:
      return {
        ...state,
        doctors: [...action.payload],
        doctorError: null,
        loading: false
      };
    case DoctorActions.SET_DOCTOR_FAILED:
      return {
        ...state,
        doctors: null,
        doctorError: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
