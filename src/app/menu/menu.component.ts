import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  dashboard() {
    this.router.navigate(['/dashboard']);
  }

  wallet() {
    this.router.navigate(['/wallet']);
  }

  transactions() {
    this.router.navigate(['/transactions']);
  }

  profile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.router.navigate(['/home']);
  }

}
