import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/apiConstants';


@Injectable({
  providedIn: 'root'
})
export class OwnersService {

  private subject = new Subject<string>();

  constructor(private http: HttpClient) { }

  getAuth(): Observable<any> {
    let url: any;
    axios.get( API_BASE_URL + 'getURLAuth', {
      headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
    }).then((res: any) => {
      console.log(res);
      url = res.data;
      this.subject.next(url);
    });
    return this.subject.asObservable();
  }

  getHearthRate(): Observable<any> {
    let url: any;
    axios.get( API_BASE_URL + 'heart_rate', {
      headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
    }).then((res: any) => {
      console.log(res);
      url = res.data;
      this.subject.next(url);
    });
    return this.subject.asObservable();
  }

  // tslint:disable-next-line:typedef
  sendEmail(url: any, data: any){
    return this.http.post(url, data);
  }
}
