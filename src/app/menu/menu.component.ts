import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  url: any;
  dashboardTag: boolean = false;
  walletTag: boolean = false;
  transactionTag: boolean = false;
  profileTag: boolean = false;

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0px";
  } 

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {

    if(!localStorage.getItem('userId')){
      this.router.navigate(['/home']);
    }

  }

  ngOnInit() {
    this.url = this.router.url;
    if (this.url === '/wallet') {
      this.wallet();
    }
    if (this.url === '/dashboard') {
      this.dashboard();
    }
    if (this.url === '/transactions') {
      this.transactions();
    }
    if (this.url === '/profile') {
      this.profile();
    }
  }

  dashboard() {
    this.router.navigate(['/dashboard']);
    this.walletTag = false;
    this.dashboardTag = true;
    this.transactionTag = false;
    this.profileTag = false;
  }

  wallet() {
    this.router.navigate(['/wallet']);
    this.walletTag = true;
    this.dashboardTag = false;
    this.transactionTag = false;
    this.profileTag = false;
  }

  transactions() {
    this.router.navigate(['/transactions']);
    this.walletTag = false;
    this.dashboardTag = false;
    this.transactionTag = true;
    this.profileTag = false;
  }

  profile() {
    this.router.navigate(['/profile']);
    this.walletTag = false;
    this.dashboardTag = false;
    this.transactionTag = false;
    this.profileTag = true;
  }

  logout() {
    this.router.navigate(['/home']);
  }

}
