import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SigningService } from './../services/signing.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  login: any = {}
  country_code: any;
  invalidMobile: any;
  loginResponse: any;
  otpScreen: boolean = false;
  otp: any;
  message:any;

  constructor(private router: Router, private signingService: SigningService) { }

  ngOnInit() {
    // this.login.phone = "+919900887766"
    // this.login.password = "00000"
    // this.country_code = '+91'
  }

  redirectToLogin(){
    this.router.navigate(['/login']);
  }

  // newLogin() {
    // this.login = {};
    // this.otpScreen = false;
    // this.otpScreen = true;
  // }

  // loginUser() {

  //   this.invalidMobile = null;
  //   if (this.login.phone && this.login.password && this.country_code) {
  //     let data = {
  //       "mobile_number": this.login.phone.split(this.country_code)[1],
  //       "password": this.login.password,
  //       "code": this.country_code
  //     }
  //     this.signingService.login(data).subscribe((data) => {
  //       this.loginResponse = data;
  //       if (this.loginResponse.message && (this.loginResponse.message == 'Existing user')) {
  //         this.router.navigate(['/dashboard']);
  //         localStorage.setItem('userId', this.loginResponse.user._id)
  //       } else if (this.loginResponse.otp) {
  //         this.otpScreen = true;
  //         localStorage.setItem('userId', this.loginResponse._id)
  //       }
  //     }, err => {

  //       // localStorage.setItem('userId', '5c0e1e4360b89e4138df36bf');
  //       // this.router.navigate(['/dashboard']);
  //       this.invalidMobile = "Incorrect Password";
  //     })
  //   } else {
  //     this.invalidMobile = "All fileds are required";
  //   }


  // }

  // countryCode(event) {

  //   if (event.target.value && event.target.value.indexOf(' ') >= 0) {
  //     this.country_code = event.target.value.split(' ')[0];
  //     this.invalidMobile = null;
  //   } else {
  //     this.invalidMobile = 'Need space between country code and mobile number';
  //   }

  // }

  // verifyOTP() {
  //   if (this.otp === this.loginResponse.otp) {
  //     this.router.navigate(['/dashboard']);
  //   } else {
  //     this.invalidMobile = "OTP Mismatch"
  //   }
  // }



}
