import {Injectable} from '@angular/core';

@Injectable()
export class SortService {

  constructor() {
  }

  sortDataAscOrder(rowData, colIindex): any[] {
    return this.sortFunc(rowData, colIindex, 1);
  }

  sortDataDescOrder(rowData, colIindex): any[] {
    return this.sortFunc(rowData, colIindex, 2);
  }

  sortFunc(rowData, colIindex, SORT_BY): any[] {
    const tempRowData = [...rowData];

    const reA = /[^a-zA-Z]/g;
    const reN = /[^0-9]/g;

    let field1;
    let field2;
    tempRowData.sort((obj1, obj2) => {
      field1 = Object.values(obj1)[colIindex];
      field2 = Object.values(obj2)[colIindex];

      if (field1 === undefined) {
        field1 = '';
      }
      if (field2 === undefined) {
        field2 = '';
      }

      if (typeof field1 === 'string') {
        field1 = field1.toLowerCase();
        field2 = field2.toLowerCase();
      }

      if (typeof field1 === 'number') {
        field1 = field1.toString(10);
      }
      if (typeof field2 === 'number') {
        field2 = field2.toString(10);
      }

      const aA = field1.replace(reA, '');
      const bA = field2.replace(reA, '');
      if (aA === bA) {
        const aN = parseInt(field1.replace(reN, ''), 10);
        const bN = parseInt(field2.replace(reN, ''), 10);
        if (SORT_BY === 1) {
          return aN === bN ? 0 : aN > bN ? 1 : -1;
        } else if (SORT_BY === 2) {
          return aN === bN ? 0 : aN > bN ? -1 : 1;
        }
      } else {
        if (SORT_BY === 1) {
          return aA > bA ? 1 : -1;
        } else if (SORT_BY === 2) {
          return aA > bA ? -1 : 1;
        }
      }
    });
    return tempRowData;
  }
}
