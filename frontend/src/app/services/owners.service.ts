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

  // getTable(): Observable<any> {
  //   let bid: any = [];
  //   axios.get( API_BASE_URL + 'getByJoin', {
  //     headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
  //   }).then((res: any) => {
  //     console.log(res);
  //     bid = res.data;
  //     this.subject.next(bid);
  //   });
  //   return this.subject.asObservable();
  // }

  // tslint:disable-next-line:typedef
  sendEmail(url: any, data: any){
    return this.http.post(url, data);
  }
}
