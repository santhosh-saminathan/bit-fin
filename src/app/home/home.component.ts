import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SigningService } from './../services/signing.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {


  constructor(private router: Router, private signingService: SigningService) { }

  ngOnInit() {

  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  redirectToSignup() {
    this.router.navigate(['/signup']);
  }


}
