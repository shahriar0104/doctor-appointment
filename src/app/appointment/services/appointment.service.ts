import {Injectable, SkipSelf} from '@angular/core';
import {Observable} from 'rxjs';
import {DoctorChoose} from '../models/doctor-choose.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {NetworkService} from '../../shared/services/network.service';

@Injectable()
export class AppointmentService {

  constructor(private http: HttpClient,
              private networkClient: NetworkService) { }

  fetchDoctors(): Observable<DoctorChoose[]> {
    return this.http.get<DoctorChoose[]>(this.networkClient.getBaseUrl() + 'doctors/');
  }

  fetchSpecificDoctors(id: number): Observable<DoctorChoose> {
    return this.http.get<DoctorChoose>(this.networkClient.getBaseUrl() + 'doctors/' + id);
  }

  checkAlreadyBooked(paramsBooked): Observable<DoctorChoose[]> {
    return this.http.get<DoctorChoose[]>(this.networkClient.getBaseUrl() + 'appointment/', {params: paramsBooked});
  }

  postAppointment(body): Observable<any> {
    return this.http.post(this.networkClient.getBaseUrl() + 'appointment/', body);
  }

  putAppointment(id, body): Observable<any> {
    return this.http.put(this.networkClient.getBaseUrl() + 'appointment/' + id, body);
  }
}
