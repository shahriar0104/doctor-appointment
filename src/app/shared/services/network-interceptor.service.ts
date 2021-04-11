import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable()
export class NetworkInterceptor implements HttpInterceptor {

  constructor(private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(tap(event => {
      }, err => {
        if (err instanceof HttpErrorResponse) { // here you can even check for err.status == 404 | 401 etc
          if (err.status >= 500) {
            this.router.navigate(['/error']);
          }
          // console.log('Error Caught By Interceptor');
          // Observable.throw(err); // send data to service which will inform the component of the error and in turn the user
        }
      })
    );
  }
}
