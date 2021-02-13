import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomEventsService {
  receiveEventData(eventName: string): Observable<unknown> {
    const observable = new Observable((subscriber) => {
      document.addEventListener(eventName, (event: Event) => {
        subscriber.next(((event as unknown) as HTMLInputElement).value);
      });
    });
    return observable;
  }

  createCustomEvent(eventName: string, dataToBeSent: unknown): Event {
    const customEvent: Event = new Event(eventName);
    ((customEvent as unknown) as HTMLInputElement).value = JSON.stringify(
      dataToBeSent
    );
    return customEvent;
  }
}
