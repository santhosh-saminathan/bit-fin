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

  constructor(private profileService: ProfileService) { }

  ngOnInit() {
  }

  documentUpload() {

  }

  updateProfile() {
    this.profileService.updateProfile(this.profileDetails).subscribe((data) => {
      console.log(data);
    }, err => {
      console.log(err);
    })
  }

  uploadKyc() {
    this.profileService.updateKYC({}).subscribe((data) => {
      console.log(data);
    }, err => {
      console.log(err);
    })
  }

  fileChangeListener($event) {
    console.log("data", $event);
    let file = $event.target.files[0];
    const myReader: FileReader = new FileReader();
    // const that = this;
    myReader.onloadend = (loadEvent: any) => {
      // this.image = loadEvent.target.result;
      console.log('file load', loadEvent.target.result);
    };
    myReader.readAsDataURL(file);
  }

}
