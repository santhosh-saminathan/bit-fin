import { Component, OnInit, ElementRef } from '@angular/core';
import { ProfileService } from './../services/profile.service';
import { ToastrService } from 'ngx-toastr';
declare var jquery:any;
declare var $ :any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./../transactions/bootstrap.css','./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileDetails: any = {};
  picDetails: any;
  maxSizeExceed: any;
  userProfileResponse: any;
  proofs: any = {};
  noContent: boolean = true;
  uploadAddressVerificationImage: any;
  uploadIdVerificationImage: any;
  uploadProofVerificationImage: any;
  waitingForResponse: boolean = false;

  constructor(public toastr: ToastrService, private profileService: ProfileService) { }

  ngOnInit() {


    this.profileService.getUserDetails().subscribe((data) => {
      this.noContent = false;
      this.userProfileResponse = data;
      if (this.userProfileResponse) {
        this.profileDetails = this.userProfileResponse;
        this.profileDetails.dob = this.profileDetails.dob.split('T')[0];
      }
    }, err => {
      this.toastr.error('Failed to get user details', 'Error!');
    })
  }


  updateProfile() {
    this.profileService.updateProfile(this.profileDetails).subscribe((data) => {
      this.toastr.success('Profile updated', 'Success!');
      this.ngOnInit();
    }, err => {
      this.toastr.error('Failed to update user details', 'Error!');
    })
  }

  uploadKyc() {
    let proofs = {
      "addressProof": this.proofs.addressProof ? this.proofs.addressProof : this.profileDetails.proofs.addressProof,
      "idProof": this.proofs.idProof ? this.proofs.idProof : this.profileDetails.proofs.idProof,
      "photoProof": this.proofs.photoProof ? this.proofs.photoProof : this.profileDetails.proofs.photoProof
    }

    this.profileService.updateKYC(proofs).subscribe((data) => {
      this.toastr.success('KYC details updated', 'Success!');
      this.ngOnInit();
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
          this.profileDetails.proofs.addressProof = this.uploadAddressVerificationImage.url;
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
          this.profileDetails.proofs.idProof = this.uploadIdVerificationImage.url;
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
          this.profileDetails.proofs.photoProof = this.uploadProofVerificationImage.url;
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

}
