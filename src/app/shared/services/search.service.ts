import { Injectable } from '@angular/core';

@Injectable()
export class SearchService {

  constructor() { }

  KMP(sourceStr, targetStr): boolean {
    sourceStr = sourceStr.toLowerCase();
    targetStr = targetStr.toLowerCase();
    if (sourceStr.length < targetStr.length) {
      return false;
    } else if (sourceStr === '') {
      return false;
    }
    const partMatchValue = this.kmpGetPartMatchTable(targetStr); // Partial matching table
    let result = false;
    // tslint:disable-next-line:one-variable-per-declaration
    let i, j, m, n;
    n = targetStr.length;
    for (i = 0, j = sourceStr.length; i < j; i++) {
      for (m = 0; m < n; m++) {
        if (targetStr.charAt(m) !== sourceStr.charAt(i + m)) {
          if ((m > 0) && (partMatchValue[m - 1] > 0)) {
            i += (m - partMatchValue[m - 1] - 1); // Set the start position of the outer loop
          }
          break;
        }
      }
      if (m === n) {
        result = true;
        break;
      }
    }
    return result;
  }

  kmpGetPartMatchTable(targetStr): any[] {
    const aPartMatchTable = [];
    let tmpCompareLen = 0;
    let tmpPartMatchVal = 0;
    let prefix;
    let suffix; // Matching string prefix, suffix
    for (let i = 0, j = targetStr.length; i < j; i++) {
      if (i === 0) {
        aPartMatchTable[i] = 0;
        continue;
      }
      tmpCompareLen = i; // Matching on the maximum length prefix, suffix
      tmpPartMatchVal = 0;
      for (; tmpCompareLen > 0; tmpCompareLen--) {
        prefix = targetStr.substr(0, tmpCompareLen);
        suffix = targetStr.substr(i - tmpCompareLen + 1, tmpCompareLen);
        if (prefix === suffix) { // Find a matching string prefix, suffix, the longest common elements
          tmpPartMatchVal = prefix.length;
          // Partial matching value is: the matching string prefix, suffix the longest total length of an element
          break;
        }
      }
      aPartMatchTable[i] = tmpPartMatchVal;
    }
    return aPartMatchTable;
  }
}
