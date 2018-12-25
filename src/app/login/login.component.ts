import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SigningService } from './../services/signing.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login: any = {}
  country_code: any;
  invalidMobile: any;
  loginResponse: any;
  otpScreen: boolean = false;
  otp: any;
  message:any;
  callingCodes:any;

  constructor(private router: Router, private signingService: SigningService) { }

  ngOnInit() {
    this.login.phone = "9900887766"
    this.login.password = "00000"
    this.login.country_code = '91';


    this.signingService.getCountryCodes().subscribe(data=>{
      console.log(data);
      this.callingCodes = data;

      this.callingCodes.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)); 


    },err=>{
      console.log(err);
    })
  }

  newLogin() {
    this.login = {};
    this.otpScreen = false;
    // this.otpScreen = true;
  }

  loginUser() {

    this.invalidMobile = null;
    if (this.login.phone && this.login.password && this.login.country_code) {
      let data = {
        "mobile_number": this.login.phone,
        "password": this.login.password,
        "code": '+'+this.login.country_code
      }
      this.signingService.login(data).subscribe((data) => {
        this.loginResponse = data;
        if (this.loginResponse.message && (this.loginResponse.message == 'Existing user')) {
          this.router.navigate(['/dashboard']);
          localStorage.setItem('userId', this.loginResponse.user._id)
        } else if (this.loginResponse.otp) {
          this.otpScreen = true;
          localStorage.setItem('userId', this.loginResponse._id)
        }
      }, err => {
        this.invalidMobile = "Incorrect Password";
      })
    } else {
      this.invalidMobile = "All fileds are required";
    }


  }

  redirectToHome(){
    this.router.navigate(['/home']);
  }

  countryCode(event) {

    if (event.target.value && event.target.value.indexOf(' ') >= 0) {
      this.country_code = event.target.value.split(' ')[0];
      this.invalidMobile = null;
    } else {
      this.invalidMobile = 'Need space between country code and mobile number';
    }

  }

  verifyOTP() {
    if (this.otp === this.loginResponse.otp) {
      this.router.navigate(['/dashboard']);
    } else {
      this.invalidMobile = "OTP Mismatch"
    }
  }

  

}








