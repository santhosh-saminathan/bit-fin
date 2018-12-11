import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  login: any = {}

  constructor(private router: Router ) { }

  ngOnInit() {
  }

  loginUser() {
    console.log("Calleds");
    this.router.navigate(['/dashboard']);
  }

}
