import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {AppointmentService} from '../services/appointment.service';
import {DoctorChoose} from '../models/doctor-choose.model';
import * as moment from 'moment';
import flatpickr from 'flatpickr';
import Swal from 'sweetalert2';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.css']
})
export class AppointmentCreateComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('flatpickrEl', {static: false, read: ElementRef}) flatpickrEl: ElementRef;
  @ViewChild('inputDate', {static: false, read: ElementRef}) inputDate: ElementRef;
  private subscription: Subscription = new Subscription();
  private picker: any;
  doctorId: number;
  doctor: DoctorChoose;
  availabilityMap = new Map();
  activeDays = [];
  activeDuration = [];
  activeHours = [];
  selectedDay: string;
  selectedHour: string;
  selectedDayIndex: number;
  disableHours = true;
  disableBtn = true;

  constructor(private activatedRoute: ActivatedRoute,
              private appointmentService: AppointmentService) {
  }

  ngOnInit(): void {
    this.doctorId = this.activatedRoute.snapshot.params.id;
    this.getInitData();
  }

  ngAfterViewInit(): void {
    this.picker = flatpickr(this.flatpickrEl.nativeElement, {
      onChange: this.onDateChanged.bind(this),
      disable: [
        (date) => {
          let dayFormat = '';
          for (const activeDay of this.activeDays) {
            if (activeDay === 'sun') {
              dayFormat += '0-';
            }
            if (activeDay === 'mon') {
              dayFormat += '1-';
            }
            if (activeDay === 'tue') {
              dayFormat += '2-';
            }
            if (activeDay === 'wed') {
              dayFormat += '3-';
            }
            if (activeDay === 'thu') {
              dayFormat += '4-';
            }
            if (activeDay === 'fri') {
              dayFormat += '5-';
            }
            if (activeDay === 'sat') {
              dayFormat += '6-';
            }
          }
          const spiltArr = dayFormat.split('-');
          // console.log(spiltArr.length);
          return (date.getDay() !== +spiltArr[0] &&
            date.getDay() !== +spiltArr[1] &&
            date.getDay() !== +spiltArr[2] &&
            date.getDay() !== +spiltArr[3] &&
            date.getDay() !== +spiltArr[4] &&
            date.getDay() !== +spiltArr[5] &&
            date.getDay() !== +spiltArr[6]
          );
        }
      ], locale: {
        firstDayOfWeek: 1
      },
      minDate: 'today',
      dateFormat: 'd-m-Y',
      wrap: true
    });
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

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.activeDays.length; i++) {
      this.activeHours.push([]);
    }

    let timeDivided;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.activeDuration.length; i++) {
      timeDivided = this.activeDuration[i].split('-');

      const date = '2021-04-11';
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
  }

  onDateChanged(selectedDates): void {
    const selectedDate = moment(selectedDates[0] || null).format('YYYY-MM-DD');
    this.inputDate.nativeElement.value = selectedDate;

    this.selectedDay = moment(selectedDates[0] || null).format('ddd').toLowerCase();
    for (const [index, activeDay] of this.activeDays.entries()) {
      if (this.selectedDay.toLowerCase() === activeDay.toLowerCase()) {
        this.selectedDayIndex = index;
      }
    }

    if (this.inputDate.nativeElement.value !== undefined || true || this.inputDate.nativeElement.value !== '') {
      this.disableHours = false;
    }
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
                if (key === this.selectedDay && value === this.inputDate.nativeElement.value + ' ' + this.selectedHour) {
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
                    putBody.push({[this.selectedDay]: this.inputDate.nativeElement.value + ' ' + this.selectedHour});
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
        {[this.selectedDay]: this.inputDate.nativeElement.value + ' ' + this.selectedHour}
      ]
    };
  }

  constructParamBooked(): HttpParams {
    const date = this.inputDate.nativeElement.value + ' ' + this.selectedHour;
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
