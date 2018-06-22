import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() { }
  TOKEN_KEY = 'token';
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + localStorage.getItem(this.TOKEN_KEY)),
    });

    return next.handle(request).do((httpEvent: HttpEvent<any>) => {
      return;
    },
      (err: any) => {

        // if (err instanceof HttpErrorResponse) {
        //   let errorMessage = 'Error caught, please contact the administrator';
        //   if (err.status === 401) {

        //     if (err.error.cause) {
        //       errorMessage = err.error.cause;
        //     }
        //     this.store.dispatch(new AuthActions.RequestLoginError(errorMessage));
        //     this.store.dispatch(new AuthActions.Go({
        //       path: [Path.LOG_IN_PAGE, {}],
        //       query: {},
        //       extras: { replaceUrl: false }
        //     }));
        //   }
        // }
      }

    );
  }
}
