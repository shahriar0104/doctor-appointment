import {
  Component, DoCheck,
  ElementRef,
  EventEmitter,
  Input, IterableDiffer, IterableDiffers,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, DoCheck {
  @Input() rowData: any[];
  @Output() newPaginatedData = new EventEmitter();
  @ViewChild('inputPageNumber1', {static: false}) inputPageNumber1: ElementRef;
  @ViewChild('inputPageNumber2', {static: false}) inputPageNumber2: ElementRef;
  private iterableDiffer: IterableDiffer<any>;
  tempRowData = [];
  paginatedData = [];
  pageNumber = 1;
  totalPage = 1;
  rowInPage = 5;

  constructor(private activatedRoute: ActivatedRoute,
              private iterableDiffers: IterableDiffers) {
    this.iterableDiffer = iterableDiffers.find([]).create(null);
  }

  ngOnInit(): void {
  }

  ngDoCheck(): void {
    const changes = this.iterableDiffer.diff(this.rowData);
    if (changes) {
      if (this.pageNumber === 1) {
        this.paginateStart();
      } else {
        this.paginateOnChanges(this.rowData);
      }
    }
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes.rowData) {
  //   }
  // }

  paginateStart(): void {
    console.log(this.rowData);
    if (this.rowData === undefined) {
      console.log('NULL data received');
      return;
    }
    this.tempRowData = [...this.rowData];
    this.totalPage = Math.ceil(this.tempRowData.length / this.rowInPage);
    if (this.totalPage === 0) {
      this.totalPage = 1;
    }
    this.paginatedData = [];
    if (this.totalPage > 1) {
      for (let i = 0; i < this.rowInPage; i++) {
        this.paginatedData.push(this.tempRowData[i]);
      }
    } else {
      // for (const data of this.tempRowData) {
      //   this.paginatedData.push(data);
      // }
      this.tempRowData.forEach(data => this.paginatedData.push(data));
    }
    console.log(this.paginatedData);
    this.newPaginatedData.emit(this.paginatedData);
  }

  paginateOnChanges(sortedData: any[]): void {
    this.tempRowData = [];
    this.tempRowData = [...sortedData];
    this.totalPage = Math.ceil(this.tempRowData.length / this.rowInPage);
    if (this.totalPage === 0) {
      this.totalPage = 1;
    }
    // console.log('TotalPage: ' + this.totalPage);
    this.paginatedData = [];

    if (this.tempRowData.length > (this.pageNumber - 1) * this.rowInPage) {
      if (this.totalPage > this.pageNumber) {
        // console.log('total page greater here');
        for (let i = (this.pageNumber - 1) * this.rowInPage; i < this.pageNumber * this.rowInPage; i++) {
          this.paginatedData.push(this.tempRowData[i]);
        }
      } else {
        // console.log('total page equal here');
        for (let i = (this.pageNumber - 1) * this.rowInPage; i < this.tempRowData.length; i++) {
          this.paginatedData.push(this.tempRowData[i]);
        }
      }
    } else {
      if (this.tempRowData.length > this.rowInPage) {
        for (let i = 0; i < this.rowInPage; i++) {
          this.paginatedData.push(this.tempRowData[i]);
        }
      } else {
        // for (const data of this.tempRowData) {
        //   this.paginatedData.push(data);
        // }
        this.tempRowData.forEach(data => this.paginatedData.push(data));
      }
      this.pageNumber = 1;
    }
    this.newPaginatedData.emit(this.paginatedData);
  }

  paginateForward(): void {
    this.paginatedData = [];
    if (this.totalPage > this.pageNumber + 1) {
      for (let i = this.pageNumber * this.rowInPage; i < (this.pageNumber + 1) * this.rowInPage; i++) {
        this.paginatedData.push(this.tempRowData[i]);
      }
    } else {
      for (let i = this.pageNumber * this.rowInPage; i < this.tempRowData.length; i++) {
        this.paginatedData.push(this.tempRowData[i]);
      }
    }
    this.pageNumber += 1;
    this.newPaginatedData.emit(this.paginatedData);
  }

  paginateBackward(): void {
    this.pageNumber -= 1;
    this.paginatedData = [];
    for (let i = ((this.pageNumber - 1) * this.rowInPage); i < this.pageNumber * this.rowInPage; i++) {
      this.paginatedData.push(this.tempRowData[i]);
    }
    this.newPaginatedData.emit(this.paginatedData);
  }

  paginateFastForward(): void {
    this.pageNumber = this.totalPage;
    this.paginatedData = [];
    for (let i = (this.pageNumber - 1) * this.rowInPage; i < this.tempRowData.length; i++) {
      this.paginatedData.push(this.tempRowData[i]);
    }
    this.newPaginatedData.emit(this.paginatedData);
  }

  paginateFastBackward(): void {
    this.pageNumber = 1;
    this.paginatedData = [];
    for (let i = 0; i < this.rowInPage; i++) {
      this.paginatedData.push(this.tempRowData[i]);
    }
    this.newPaginatedData.emit(this.paginatedData);
  }

  paginateByPageNumber(sortedData: any[], pageNumber: number): void {
    this.pageNumber = pageNumber;
    this.paginatedData = [];
    this.tempRowData = [];
    this.tempRowData = [...sortedData];

    this.totalPage = Math.ceil(this.tempRowData.length / this.rowInPage);
    if (this.totalPage === 0) {
      this.totalPage = 1;
    }

    if (this.totalPage > this.pageNumber) {
      console.log(this.tempRowData);
      for (let i = (this.pageNumber - 1) * this.rowInPage; i < this.pageNumber * this.rowInPage; i++) {
        this.paginatedData.push(this.tempRowData[i]);
      }
    } else {
      for (let i = (this.pageNumber - 1) * this.rowInPage; i < this.tempRowData.length; i++) {
        this.paginatedData.push(this.tempRowData[i]);
      }
    }

    this.newPaginatedData.emit(this.paginatedData);
  }

  clickedPage(pageNumber): void {
    // stop-propagation off here to close the dropdown-menu
    $('.dropdown-menu').removeClass('show');

    if (this.pageNumber !== Number(pageNumber)) {
      this.pageNumber = Number(pageNumber);
      if (this.pageNumber === 1) {
        this.paginateFastBackward();
      } else if (this.pageNumber === 29) {
        this.paginateFastForward();
      } else {
        this.paginatedData = [];

        for (let i = (this.pageNumber - 1) * this.rowInPage; i < this.pageNumber * this.rowInPage; i++) {
          this.paginatedData.push(this.tempRowData[i]);
        }
        this.newPaginatedData.emit(this.paginatedData);
      }
    }
  }

  getPageNumber(): number {
    return this.pageNumber.valueOf();
  }

  changePage(inputPageNumber: number, type: string): void {
    let input;
    if (inputPageNumber === 1) {
      input = Number(this.inputPageNumber1.nativeElement.value);
    } else if (inputPageNumber === 2) {
      input = Number(this.inputPageNumber2.nativeElement.value);
    }
    if (type === '+') {
      input++;
    } else if (type === '-') {
      input--;
    }

    if (inputPageNumber === 1 && (input >= 1 && input <= this.totalPage)) {
      this.inputPageNumber1.nativeElement.value = input;
    } else if (inputPageNumber === 2 && (input >= 1 && input <= this.totalPage)) {
      this.inputPageNumber2.nativeElement.value = input;
    }
  }

  validateNumber(event: KeyboardEvent): void {
    // bindings within page 1 to last page
    const max = this.totalPage;
    $('#inputPageNumber1').on('keypress', (e) => {
      const currentValue = String.fromCharCode(e.which);
      const finalValue = Number($(this).val() + currentValue);
      if (finalValue > max || finalValue < 1) {
        e.preventDefault();
      }
    });

    $('#inputPageNumber2').on('keypress', (e) => {
      const currentValue = String.fromCharCode(e.which);
      const finalValue = Number($(this).val() + currentValue);
      if (finalValue > max || finalValue < 1) {
        e.preventDefault();
      }
    });

    // negative and without number bindings
    const keyCode = event.keyCode;
    if (!((keyCode > 95 && keyCode < 106)
      || (keyCode > 47 && keyCode < 58)
      || keyCode === 8)) {
      event.preventDefault();
    }
  }

}

