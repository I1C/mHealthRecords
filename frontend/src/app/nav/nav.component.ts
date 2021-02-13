import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomEventsService } from '../services/custom-events.service';



@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  sharedUserName: unknown;
  image: unknown;
  name: unknown;
  isLoggedIn = false;
  userImageLink: any;

  constructor(private customEventsService: CustomEventsService, private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.name = 'userName';
      this.image = 'userImage';
      this.isLoggedIn = true;
      this.userImageLink = localStorage.getItem('user_profile');
    }
    this.customEventsService
      .receiveEventData('customEvent')
      .subscribe((result) => {
        this.name = JSON.parse(String(result)).userName;
        this.image = JSON.parse(String(result)).userImage;
        this.isLoggedIn = JSON.parse(String(result)).isLoggedIn;
        this.userImageLink = JSON.parse(String(result)).userImageLink;
        if (localStorage.getItem('token')) {
          this.isLoggedIn = true;
          this.userImageLink = localStorage.getItem('user_profile');
        }
      });
  }

  getLogout(): void {
    localStorage.clear();
    this.image = '';
    this.name = '';
    this.isLoggedIn = false;
  }

  user(): void{
    if (localStorage.getItem('token')){
      this.router.navigate(['"home"']);
    }
  }
}
