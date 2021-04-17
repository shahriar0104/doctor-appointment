import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {AppointmentService} from '../services/appointment.service';
import {DoctorChoose} from '../models/doctor-choose.model';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import {HttpParams} from '@angular/common/http';
import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';
import {Patient} from '../models/patient.model';
import {NgForm} from '@angular/forms';
import {LoadingBarService} from '@ngx-loading-bar/core';

@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.css']
})
export class AppointmentCreateComponent implements OnInit, OnDestroy {
  @ViewChild('form', {static: false}) form: NgForm;
  private subscription: Subscription = new Subscription();
  doctorId: number;
  doctor: DoctorChoose;
  availabilityMap = new Map();
  activeDays = [];
  inActiveDays = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'];
  activeDuration = [];
  activeHours = [];
  selectedDay: string;
  selectedDate: string;
  selectedHour: string;
  selectedDayIndex: number;
  disableHours = true;
  disableBtn = true;

  lastPatientInfo: Patient;

  myDpOptions: IAngularMyDpOptions;
  model: IMyDateModel = null;

  constructor(private activatedRoute: ActivatedRoute,
              private appointmentService: AppointmentService,
              private loadingBarService: LoadingBarService) {
  }

  ngOnInit(): void {
    this.doctorId = this.activatedRoute.snapshot.params.id;
    this.getInitData();
  }

  getInitData(): void {
    this.loadingBarService.start();
    this.subscription.add(
      this.appointmentService.fetchSpecificDoctors(this.doctorId)
        .subscribe(response => {
          this.doctor = response;
          this.processDoctorData(this.doctor.availability);
        }, error => {
          this.loadingBarService.complete();
          Swal.fire({
            title: 'ERROR!!!',
            text: error.error.message + '',
            icon: 'error',
            allowOutsideClick: false
          });
        }),
    );
  }

  processDoctorData(availability): void {
    if (Object.keys(availability).length !== 0) {
      for (const [key, value] of Object.entries(availability)) {
        this.availabilityMap.set(`${key}`, `${value}`);
        this.activeDays.push(`${key}`);
        this.activeDuration.push(`${value}`);
      }
    }
    this.createDpOptions();
    this.loadingBarService.complete();
  }

  createDpOptions(): void {
    this.inActiveDays = this.inActiveDays.filter(val => !this.activeDays.includes(val));
    for (let i = 0; i < this.inActiveDays.length; i++) {
      this.inActiveDays[i] = this.inActiveDays[i].slice(0, -1);
    }
    // console.log(this.inActiveDays);

    const myTime = new Date();
    this.myDpOptions = {
      dateRange: false,
      dateFormat: 'dd-mm-yyyy',
      // inline: true,
      markCurrentDay: true,
      disableUntil: {year: myTime.getUTCFullYear(), month: myTime.getUTCMonth() + 1, day: myTime.getUTCDate() - 1},
      disableWeekdays: this.inActiveDays,
    };
  }

  afterDateChanged(): void {
    this.activeHours = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.activeDays.length; i++) {
      this.activeHours.push([]);
    }

    let timeDivided;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.activeDuration.length; i++) {
      timeDivided = this.activeDuration[i].split('-');

      const date = this.selectedDate;
      const time = timeDivided[0].trim();
      const lastTime = timeDivided[1].trim();
      let dateTime = date + ' ' + time;

      this.activeHours[i].push(moment(dateTime).format('hh:mm a'));
      let k = moment(dateTime).valueOf();

      while (k < moment(date + ' ' + lastTime).valueOf()) {
        dateTime = moment(dateTime).add(this.doctor.visitDurationInMin, 'minutes').toString();
        this.activeHours[i].push(moment(dateTime).format('hh:mm a'));
        k = moment(dateTime).valueOf();
      }
    }
    console.log(this.activeHours);
  }

  onMyDateChanged(event: IMyDateModel): void {
    console.log(event.singleDate.jsDate);
    this.selectedDate = moment(event.singleDate.jsDate).format('YYYY-MM-DD');

    this.selectedDay = moment(event.singleDate.jsDate).format('ddd').toLowerCase();
    console.log(this.selectedDay);
    for (const [index, activeDay] of this.activeDays.entries()) {
      console.log(activeDay);
      console.log(this.selectedDay);
      if (this.selectedDay === activeDay) {
        this.selectedDayIndex = index;
      }
    }
    console.log(this.selectedDayIndex);

    if (this.selectedDate !== undefined || true || this.selectedDate !== '') {
      this.disableHours = false;
    }
    console.log(this.selectedDate);
    this.afterDateChanged();
  }

  clearMyDate(): void {
    this.disableHours = true;
    this.disableBtn = true;
  }

  changeTime(event): void {
    this.selectedHour = event.target.value;
    if (this.selectedHour !== undefined) {
      this.disableBtn = false;
    }
  }

  checkBookAppointment(): void {
    this.disableBtn = true;

    this.subscription.add(
      this.appointmentService.fetchAppointments()
        .subscribe(response => {
          this.processBookedAppointment(response);
        }, error => {
          this.disableBtn = false;
          Swal.fire({
            title: 'ERROR!!!',
            text: error.error.message,
            icon: 'error',
            allowOutsideClick: false
          });
        })
    );
  }

  processBookedAppointment(response: Patient[]): void {
    console.log(response);
    if (response.length === 0) {
      console.log('from create');
      this.createAppointment();
    } else {
      const patient = this.patientMatchFull(response);
      if (patient !== null) {
        // tslint:disable-next-line:prefer-for-of
          const scheduleArr = patient.doctorInfo.schedule;
          console.log(scheduleArr);
          const putBody = [];
          let breakPtr = false;

          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < scheduleArr.length; i++) {
            const schedule = scheduleArr[i];
            putBody.push(schedule);
            // tslint:disable-next-line:forin
            for (const property in schedule) {
              // console.log(`${property}: ${schedule[property]}`);
              const key = `${property}`;
              const value = `${schedule[property]}`;
              if (key === this.selectedDay && value === this.selectedDate + ' ' + this.selectedHour) {
                Swal.fire({
                  title: 'ERROR!!!',
                  text: 'Already booked this appointment time',
                  icon: 'error',
                  allowOutsideClick: false
                });

                this.disableBtn = false;
                breakPtr = true;
                break;
              } else {
                console.log(breakPtr);
                if (breakPtr) {
                  break;
                } else if (i === scheduleArr.length - 1) {
                  console.log('from put');
                  putBody.push({[this.selectedDay]: this.selectedDate + ' ' + this.selectedHour});
                  this.putAppointment(putBody);
                  break;
                }
              }
            }
          }
      } else {
        console.log('from down create');
        this.createAppointment();
      }
    }
  }

  patientMatchFull(response: Patient[]): Patient {
    const body = this.createPatientBody();
    // tslint:disable-next-line:prefer-for-of
    let patient;
    for (let i = 0; i < response.length; i++) {
      patient = response[i];
      if (
        patient.patientName === body.patientName &&
        patient.mobile === body.mobile &&
        patient.address === body.address &&
        patient.visitReason === body.visitReason
      ) {
        console.log('match fully');
        return patient;
      } else if (i === response.length - 1) {
        console.log('not match fully');
        return null;
      }
    }
  }

  putAppointment(body): void {
    this.subscription.add(
      this.appointmentService.putAppointment(this.doctorId, this.createPutBody(body))
        .subscribe(response => {
          this.disableBtn = false;
          this.lastPatientInfo = response;
          console.log(response);
          Swal.fire({
            title: 'SUCCESS!!!',
            text: 'appointment created',
            icon: 'success',
            allowOutsideClick: false
          });
        }, error => {
          this.disableBtn = false;
          Swal.fire({
            title: 'ERROR!!!',
            text: error.error.message + '',
            icon: 'error',
            allowOutsideClick: false
          });
        }),
    );
  }

  createAppointment(): void {
    this.subscription.add(
      this.appointmentService.postAppointment(this.createPostBody())
        .subscribe(response => {
          this.disableBtn = false;
          this.lastPatientInfo = response;
          console.log(response);
          Swal.fire({
            title: 'SUCCESS!!!',
            text: 'appointment created',
            icon: 'success',
            allowOutsideClick: false
          });
        }, error => {
          this.disableBtn = false;
          Swal.fire({
            title: 'ERROR!!!',
            text: error.error.message + '',
            icon: 'error',
            allowOutsideClick: false
          });
        }),
    );
  }

  createPutBody(putBody): Patient {
    const body = this.createPatientBody();
    body.doctorInfo = {
      id: this.doctor.id,
      name: this.doctor.name,
      org: this.doctor.org,
      image: this.doctor.image,
      schedule: putBody
    };
    console.log(body);
    return body;
  }

  createPostBody(): Patient {
    const body = this.createPatientBody();
    body.doctorInfo = {
      id: this.doctor.id,
      name: this.doctor.name,
      org: this.doctor.org,
      image: this.doctor.image,
      schedule: [
        {[this.selectedDay]: this.selectedDate + ' ' + this.selectedHour}
      ]
    };
    console.log(body);
    return body;
  }

  createPatientBody(): Patient {
    return {
      patientName: (this.form.value.patientName).trim(),
      mobile: (this.form.value.mobile).trim(),
      address: (this.form.value.address).trim(),
      visitReason: (this.form.value.visitReason).trim(),
    };
  }

  constructParamBooked(): HttpParams {
    const date = this.selectedDate + ' ' + this.selectedHour;
    console.log(this.lastPatientInfo);
    let params = new HttpParams();
    if (this.lastPatientInfo !== undefined) {
      params = params.append('patientName', this.lastPatientInfo.patientName);
      params = params.append('mobile', this.lastPatientInfo.mobile);
      params = params.append('address', this.lastPatientInfo.address);
      params = params.append('visitReason', this.lastPatientInfo.visitReason);
      params = params.append('doctorInfo.id', this.doctorId + '');
    }
    // params = params.append(`schedule.${this.selectedDay}`, date);
    console.log(params);
    return params;
  }

  isNumber(event): void {
    const char = String.fromCharCode(event.which);
    if (!(/[0-9\+\#\*]/.test(char))) {
      event.preventDefault();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
