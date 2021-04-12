import {DoctorChoose} from './doctor-choose.model';

export interface Patient {
  patientName?: string;
  mobile?: string;
  address?: string;
  visitReason?: string;
  doctorInfo?: DoctorChoose;
}
