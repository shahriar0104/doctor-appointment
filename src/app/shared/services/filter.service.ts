import {Injectable} from '@angular/core';
import {SearchService} from './search.service';

@Injectable()
export class FilterService {

  constructor(private searchService: SearchService) {
  }

  filter(rowData: any[], targetStr: string): any[] {
    if (targetStr === '') {
      return null;
    } else {
      let tempRowData = [...rowData];
      const dummyRowData = [];

      if (targetStr !== '') {
        for (const obj of tempRowData) {
          if (this.searchService.KMP(Object.values(obj)[1] + '' + Object.values(obj)[3], targetStr) === true) {
            dummyRowData.push(obj);
          }
        }
        tempRowData = [];
        tempRowData = [...dummyRowData];
        // dummyRowData = [];
      }
      return tempRowData;
    }
  }
}
