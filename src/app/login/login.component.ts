import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SigningService } from './../services/signing.service';
import { ProfileService } from './../services/profile.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

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

  otp: any;
  message: any;
  callingCodes: any;
  profile: any = {};
  proofs: any = {};
  uploadAddressVerificationImage: any;
  uploadIdVerificationImage: any;
  uploadProofVerificationImage: any;
  waitingForResponse: boolean = false;

  showOtp: boolean = false;
  showLogin: boolean = false;
  showProfile: boolean = false;
  showKyc: boolean = false;
  url: any;

  constructor(private route: ActivatedRoute, public toastr: ToastrService, private profileService: ProfileService, private router: Router, private signingService: SigningService) { }

  ngOnInit() {


    if (this.router.url == '/signup') {
      this.url = "signup";
      this.login.phone = null
      this.login.password = null

    } else {
      this.login.phone = "9900887766"
      this.login.password = "00000"
      this.login.country_code = '91';

      this.url = "signin";
    }


    this.showLoginScreen();


    this.signingService.getCountryCodes().subscribe(data => {
      this.callingCodes = data;
      this.callingCodes.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    }, err => {
      console.log(err);
    })
  }

  newLogin() {
    this.login = {};
    this.url = "signup";
    this.showLoginScreen();
  }

  signIn(){
    this.router.navigate(['/login']);
  }

  signUp(){
    this.router.navigate(['/signup']);
  }

  loginUser() {

    this.invalidMobile = null;
    if (this.login.phone && this.login.password && this.login.country_code) {
      let data = {
        "mobile_number": this.login.phone,
        "password": this.login.password,
        "code": '+' + this.login.country_code
      }
      this.signingService.login(data).subscribe((data) => {
        this.loginResponse = data;
        if (this.loginResponse.message && (this.loginResponse.message == 'Existing user')) {
          this.router.navigate(['/dashboard']);
          localStorage.setItem('userId', this.loginResponse.user._id)
        } else if (this.loginResponse.otp) {
          this.showOtpScreen();
          localStorage.setItem('userId', this.loginResponse._id);
        }
      }, err => {
        this.invalidMobile = "Incorrect Password";
      })
    } else {
      this.invalidMobile = "All fileds are required";
    }


  }

  redirectToHome() {
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
      // this.router.navigate(['/dashboard']);
      this.showProfileScreen();
    } else {
      this.invalidMobile = "OTP Mismatch"
    }
  }


  updateProfile() {
    console.log(this.profile);
    this.profileService.updateProfile(this.profile).subscribe((data) => {
      console.log(data);
      // this.toastr.success('Profile updated', 'Success!');
      // this.ngOnInit();
      this.showKycScreen();
    }, err => {
      // this.showKycScreen();
      this.toastr.error('Failed to update user details', 'Error!');
    })
  }

  skipProfile() {
    this.showKycScreen();
  }

  skipKyc() {
    this.router.navigate(['/dashboard']);
  }


  uploadKyc() {
    let proofsObj = {
      "addressProof": this.proofs.addressProof ? this.proofs.addressProof : null,
      "idProof": this.proofs.idProof ? this.proofs.idProof : null,
      "photoProof": this.proofs.photoProof ? this.proofs.photoProof : null
    }

    console.log(proofsObj);
    this.profileService.updateKYC(proofsObj).subscribe((data) => {
      console.log(data);
      // this.toastr.success('KYC details updated', 'Success!');
      // this.ngOnInit();
      this.router.navigate(['/dashboard']);
    }, err => {
      this.toastr.error('Failed to update user KYC details', 'Error!');
    })
  }


  addressProofUpdate($event) {
    this.waitingForResponse = true;
    let file = $event.target.files[0];
    const myReader: FileReader = new FileReader();
    myReader.onloadend = (loadEvent: any) => {
      let image = loadEvent.target.result.split('base64,')[1];

      this.profileService.uploadImage({ 'image': image }).subscribe(data => {
        this.uploadAddressVerificationImage = data;
        if (this.uploadAddressVerificationImage) {
          this.waitingForResponse = false;
          this.proofs.addressProof = this.uploadAddressVerificationImage.url;
        } else {
          this.toastr.error('Error while reading image', 'Error!');
        }
      }, err => {
        this.toastr.error('Error while reading image', 'Error!');
      })


    };
    myReader.readAsDataURL(file);
  }

  idProofUpdate($event) {
    this.waitingForResponse = true;
    let file = $event.target.files[0];
    const myReader: FileReader = new FileReader();
    myReader.onloadend = (loadEvent: any) => {
      let image = loadEvent.target.result.split('base64,')[1];

      this.profileService.uploadImage({ 'image': image }).subscribe(data => {
        this.uploadIdVerificationImage = data;
        if (this.uploadIdVerificationImage) {
          this.waitingForResponse = false;
          this.proofs.idProof = this.uploadIdVerificationImage.url;
        } else {
          this.toastr.error('Error while reading image', 'Error!');
        }
      }, err => {
        this.toastr.error('Error while reading image', 'Error!');
      })


    };
    myReader.readAsDataURL(file);
  }

  photoProofUpdate($event) {
    this.waitingForResponse = true;
    let file = $event.target.files[0];
    const myReader: FileReader = new FileReader();
    myReader.onloadend = (loadEvent: any) => {
      let image = loadEvent.target.result.split('base64,')[1];

      this.profileService.uploadImage({ 'image': image }).subscribe(data => {
        this.uploadProofVerificationImage = data;
        if (this.uploadProofVerificationImage) {
          this.waitingForResponse = false;
          this.proofs.photoProof = this.uploadProofVerificationImage.url;
        } else {
          this.toastr.error('Error while reading image', 'Error!');
        }
      }, err => {
        this.toastr.error('Error while reading image', 'Error!');
      })

    };
    myReader.readAsDataURL(file);
  }

  showLoginScreen() {
    this.showLogin = true;
    this.showOtp = false;
    this.showProfile = false;
    this.showKyc = false;
  }

  showOtpScreen() {
    this.showLogin = false;
    this.showOtp = true;
    this.showProfile = false;
    this.showKyc = false;
  }

  showProfileScreen() {
    this.invalidMobile = null;
    this.showLogin = false;
    this.showOtp = false;
    this.showProfile = true;
    this.showKyc = false;
  }

  showKycScreen() {
    this.invalidMobile = null;
    this.showLogin = false;
    this.showOtp = false;
    this.showProfile = false;
    this.showKyc = true;
  }



}





