import { Component, OnInit } from '@angular/core';
import { OwnersService } from '../services/owners.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  heartRate: any;
  heartRateProvider: any;
  url: any;

  constructor(private owners: OwnersService) { }

  ngOnInit(): void {
  }

  public getAuth(): void {
    this.owners.getAuth().subscribe(
      (data: any) => {
        this.url = data;
      }
    );
    console.log(this.url);
  }
}
