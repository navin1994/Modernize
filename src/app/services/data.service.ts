import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataService {
private http = inject(HttpClient);

    private getHeaders() {
        return {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            // Add any required headers like Authorization if needed
          })
        };
      }

    getFieldData(url: string): Observable<any> {
      try {
        return this.http.get(url, this.getHeaders());
      } catch(error) {
        console.log(error);
        return of([]);
      }
    }

    private handleError(error: any): Observable<never> {
        // Custom error handling logic
        console.error('An error occurred', error);
        return throwError(() => new Error('Something bad happened; please try again later.'));
    }
}