import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PaginationComponent} from '../../shared/components/pagination/pagination.component';
import {Subscription, throwError} from 'rxjs';
import {DoctorChoose} from '../models/doctor-choose.model';
import {AppointmentService} from '../services/appointment.service';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor-choose',
  templateUrl: './doctor-choose.component.html',
  styleUrls: ['./doctor-choose.component.css']
})
export class DoctorChooseComponent implements OnInit, OnDestroy {
  @ViewChild(PaginationComponent, {static: false}) paginate: PaginationComponent;
  private subscription: Subscription = new Subscription();

  rowData: DoctorChoose[];
  tempRowData: DoctorChoose[];
  paginatedData: DoctorChoose[];

  constructor(private cdr: ChangeDetectorRef,
              private router: Router,
              private appointmentService: AppointmentService) { }

  ngOnInit(): void {
    this.paginatedData = [];
    this.getInitData();
  }

  getInitData(): void {
    this.subscription.add(
      this.appointmentService.fetchDoctors()
        .subscribe(response => {
          this.rowData = response;
          console.log(response);
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

  changePaginatedData(data): void {
    this.paginatedData = data;
    this.cdr.detectChanges();
  }

  chooseDoctor(id: number): void {
    this.router.navigate(['/create/', id]);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.cdr.detach();
  }
}
