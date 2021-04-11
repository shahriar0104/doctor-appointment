import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PaginationComponent} from '../../shared/components/pagination/pagination.component';
import {Subscription, throwError} from 'rxjs';
import {DoctorChoose} from '../models/doctor-choose.model';
import {AppointmentService} from '../services/appointment.service';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import Swal from 'sweetalert2';
import {FilterService} from '../../shared/services/filter.service';
import {SortService} from '../../shared/services/sort.service';

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

  targetStr = '';
  defaultActive: boolean[];
  ascActive: boolean[];
  descActive: boolean[];
  lastSortedIndex: number;
  rowDataLength: number;
  selectedSortIndex = 0;

  columnDefs = [
    {headerName: 'Id', sortable: true},
    {headerName: 'Name', sortable: true},
    {headerName: 'image', sortable: false},
    {headerName: 'org', sortable: true, hidden: true},
    {headerName: 'availability', sortable: false},
    {headerName: 'Visit Duration In Min', sortable: false},
  ];

  constructor(private cdr: ChangeDetectorRef,
              private router: Router,
              private appointmentService: AppointmentService,
              private filterService: FilterService,
              private sortService: SortService) { }

  ngOnInit(): void {
    this.defaultActive = [];
    this.ascActive = [];
    this.descActive = [];
    this.paginatedData = [];
    for (const {} of this.columnDefs) {
      this.defaultActive.push(true);
      this.ascActive.push(false);
      this.descActive.push(false);
    }
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

  onFilter(): void {
    this.tempRowData = this.filterService.filter(this.rowData, this.targetStr);
    if (this.tempRowData === null) {
      this.tempRowData = [...this.rowData];
      this.sortFilteredData();
    } else {
      this.sortFilteredData();
    }
  }

  sortBy(index): void {
    console.log(index);
    this.lastSortedIndex = index;
    if (this.defaultActive[index] === true) {
      this.defaultActive[index] = false;
      this.ascActive[index] = true;
      this.descActive[index] = false;
    } else if (this.ascActive[index] === true) {
      this.defaultActive[index] = false;
      this.ascActive[index] = false;
      this.descActive[index] = true;
    } else {
      if (this.tempRowData.length < this.rowDataLength) {
        this.defaultActive[index] = false;
        this.ascActive[index] = true;
        this.descActive[index] = false;
      } else {
        this.defaultActive[index] = true;
        this.ascActive[index] = false;
        this.descActive[index] = false;
      }
    }
    this.sortFilteredData();
  }

  sortFilteredData(): void {
    if (this.ascActive[this.lastSortedIndex] === true) {
      this.tempRowData = this.sortService.sortDataAscOrder(this.tempRowData, this.lastSortedIndex);
    } else if (this.descActive[this.lastSortedIndex] === true) {
      this.tempRowData = this.sortService.sortDataDescOrder(this.tempRowData, this.lastSortedIndex);
    } else {
      if (this.tempRowData.length === this.rowDataLength) {
        this.tempRowData = this.rowData;
      }
    }
    this.paginate.paginateOnChanges(this.tempRowData);
  }

  changeSortIndex(event): void {
    this.selectedSortIndex = +event.target.value;
  }

  chooseDoctor(id: number): void {
    this.router.navigate(['/create/', id]);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.cdr.detach();
  }
}
