import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {AppointmentService} from '../services/appointment.service';
import {DoctorChoose} from '../models/doctor-choose.model';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import {HttpParams} from '@angular/common/http';
import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';

@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.css']
})
export class AppointmentCreateComponent implements OnInit, OnDestroy {
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

  myDpOptions: IAngularMyDpOptions;
  model: IMyDateModel = null;

  constructor(private activatedRoute: ActivatedRoute,
              private appointmentService: AppointmentService) {
  }

  ngOnInit(): void {
    this.doctorId = this.activatedRoute.snapshot.params.id;
    this.getInitData();
  }

  getInitData(): void {
    this.subscription.add(
      this.appointmentService.fetchSpecificDoctors(this.doctorId)
        .subscribe(response => {
          this.doctor = response;
          this.processDoctorData(this.doctor.availability);
        }, error => {
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
      this.appointmentService.checkAlreadyBooked(this.constructParamBooked())
        .subscribe(response => {

          if (response.length !== 0) {
            const scheduleArr = response[0].schedule;

            console.log(scheduleArr);
            const putBody = [];
            let breakPtr = false;

            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < scheduleArr.length; i++) {
              const schedule = scheduleArr[i];
              // tslint:disable-next-line:forin
              for (const property in schedule) {
                // console.log(`${property}: ${schedule[property]}`);
                putBody.push(schedule);
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
            console.log('from create');
            this.createAppointment();
          }
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

  putAppointment(body): void {
    this.subscription.add(
      this.appointmentService.putAppointment(this.doctorId, this.createPutBody(body))
        .subscribe(response => {
          this.disableBtn = false;
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

  createPutBody(putBody): DoctorChoose {
    return {
      id: this.doctor.id,
      name: this.doctor.name,
      org: this.doctor.org,
      image: this.doctor.image,
      schedule: putBody
    };
  }

  createPostBody(): DoctorChoose {
    return {
      id: this.doctor.id,
      name: this.doctor.name,
      org: this.doctor.org,
      image: this.doctor.image,
      schedule: [
        {[this.selectedDay]: this.selectedDate + ' ' + this.selectedHour}
      ]
    };
  }

  constructParamBooked(): HttpParams {
    const date = this.selectedDate + ' ' + this.selectedHour;
    let params = new HttpParams();
    params = params.append('id', this.doctorId + '');
    // params = params.append(`schedule.${this.selectedDay}`, date);
    console.log(params);
    return params;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
