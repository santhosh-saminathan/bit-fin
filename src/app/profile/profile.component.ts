import { Component, OnInit, ElementRef } from '@angular/core';
import { ProfileService } from './../services/profile.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileDetails: any = {};
  picDetails: any;
  maxSizeExceed: any;
  userProfileResponse: any;
  proofs: any = {};
  noContent: boolean = true;

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

  documentUpload() {

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
    let file = $event.target.files[0];
    const myReader: FileReader = new FileReader();
    myReader.onloadend = (loadEvent: any) => {
      this.profileDetails.proofs.addressProof = loadEvent.target.result;
      this.proofs.addressProof = loadEvent.target.result;
    };
    myReader.readAsDataURL(file);
  }

  idProofUpdate($event) {
    let file = $event.target.files[0];
    const myReader: FileReader = new FileReader();
    myReader.onloadend = (loadEvent: any) => {
      this.profileDetails.proofs.idProof = loadEvent.target.result;
      this.proofs.idProof = loadEvent.target.result;
    };
    myReader.readAsDataURL(file);
  }

  photoProofUpdate($event) {
    let file = $event.target.files[0];
    const myReader: FileReader = new FileReader();
    myReader.onloadend = (loadEvent: any) => {
      this.profileDetails.proofs.photoProof = loadEvent.target.result;
      this.proofs.photoProof = loadEvent.target.result;
    };
    myReader.readAsDataURL(file);
  }

}
