import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpHeaders} from '@angular/common/http';

const BASE_URL = environment.base_url;

@Injectable()
export class NetworkService {

  constructor() { }

  getBaseUrl(): string {
    return BASE_URL;
  }

  getOptions(): any {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return {headers};
  }
}
