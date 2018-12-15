import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  yourMobileNumber: any = '993434343';
  savedCards: any;

  constructor() { }

  ngOnInit() {
    this.savedCards = [{
      cardType: 'visa',
      cardNumber: '99998989942343',
      expDate: '11/2034',
      holderName: 'Santhosh kumar saminathan',
      cvv: '566'
    },
    {
      cardType: 'master',
      cardNumber: '99998989942343',
      expDate: '10/2034',
      holderName: 'Santhosh2',
      cvv: '566'
    },
    {
      cardType: 'platinum',
      cardNumber: '99998989942343',
      expDate: '11/2034',
      holderName: 'Santhosh3',
      cvv: '566'
    }, {
      cardType: 'visa',
      cardNumber: '99998989942343',
      expDate: '12/2034',
      holderName: 'Santhosh4',
      cvv: '566'
    }]
  }

  selectedCard(card) {
    // console.log(card)
    card.selected = true;
  }

}
