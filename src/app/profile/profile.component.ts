import { Component, OnInit, ElementRef } from '@angular/core';
import { ProfileService } from './../services/profile.service';

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

  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.profileService.getUserDetails().subscribe((data) => {
      console.log(data);
      this.userProfileResponse = data;
      if (this.userProfileResponse) {
        this.profileDetails = this.userProfileResponse;
        this.profileDetails.dob = this.profileDetails.dob.split('T')[0];
      }
    }, err => {
      console.log(err);
    })
  }

  documentUpload() {

  }

  updateProfile() {
    this.profileService.updateProfile(this.profileDetails).subscribe((data) => {
      console.log(data);
      this.ngOnInit();
    }, err => {
      console.log(err);
    })
  }

  uploadKyc() {
    let proofs = {
      "addressProof": this.proofs.addressProof ? this.proofs.addressProof : this.profileDetails.proofs.addressProof,
      "idProof": this.proofs.idProof ? this.proofs.idProof : this.profileDetails.proofs.idProof,
      "photoProof": this.proofs.photoProof ? this.proofs.photoProof : this.profileDetails.proofs.photoProof
    }

    this.profileService.updateKYC(proofs).subscribe((data) => {
      console.log(data);
      this.ngOnInit();
    }, err => {
      console.log(err);
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
