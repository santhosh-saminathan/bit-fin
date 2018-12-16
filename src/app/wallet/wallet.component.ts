import { Component, OnInit } from '@angular/core';
import { WalletService } from './../services/wallet.service';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ProfileService } from './../services/profile.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  yourMobileNumber: any = '993434343';
  savedCards: any;
  receiverMobileNumber: any;
  autocompleteNumbers: any;
  availableBalance: any;
  selectedReceiver: any;
  amountToSend: any = 0;
  feePercentage: any = 0.1;

  // elements: Elements;
  // card: StripeElement;

  // // optional parameters
  // elementsOptions: ElementsOptions = {
  //   locale: 'es'
  // };

  // stripeTest: FormGroup;

  // constructor(private walletService: WalletService, private fb: FormBuilder, private stripeService: StripeService) { }

  constructor(private walletService: WalletService, private profileService: ProfileService) { }

  ngOnInit() {

    this.profileService.getBalance().subscribe(data => {
      console.log(data);
      this.availableBalance = data;
    }, err => {
      console.log(err);
    });


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

    // this.stripeTest = this.fb.group({
    //   name: ['', [Validators.required]]
    // });
    // this.stripeService.elements(this.elementsOptions)
    //   .subscribe(elements => {
    //     this.elements = elements;
    //     // Only mount the element the first time
    //     if (!this.card) {
    //       this.card = this.elements.create('card', {
    //         style: {
    //           base: {
    //             iconColor: '#666EE8',
    //             color: '#31325F',
    //             lineHeight: '40px',
    //             fontWeight: 300,
    //             fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    //             fontSize: '18px',
    //             '::placeholder': {
    //               color: '#CFD7E0'
    //             }
    //           }
    //         }
    //       });
    //       this.card.mount('#card-element');
    //     }
    //   });


  }


  // buy() {
  //   const name = this.stripeTest.get('name').value;
  //   this.stripeService
  //     .createToken(this.card, { name })
  //     .subscribe(token => {
  //       if (token) {
  //         // Use the token to create a charge or a customer
  //         // https://stripe.com/docs/charges
  //         console.log(token);
  //       } else {
  //         // Error creating the token
  //         // console.log(result.error.message);
  //       }
  //     });
  // }

  selectedCard(card) {
    // console.log(card)
    card.selected = true;
  }

  getAutocompleteMobileNumbers() {
    console.log(this.receiverMobileNumber);
    this.walletService.autocompleteMobileNumber(this.receiverMobileNumber).subscribe((data) => {
      console.log(data);
      this.autocompleteNumbers = data;
    }, err => {
      console.log(err);
    })
  }

  getUserCardDetails() {
    this.walletService.userSavedCardDetails().subscribe(data => {
      console.log(data);
    }, err => {
      console.log(err);
    })
  }

  getUserWithdrawSavedCardDetails() {
    this.walletService.savedWithdrawCardDetails().subscribe(data => {
      console.log(data);
    }, err => {
      console.log(err);
    })
  }

  selectedAccount(data) {
    console.log(data);
    this.selectedReceiver = data;
    this.receiverMobileNumber = this.selectedReceiver.mobile_number;
    this.autocompleteNumbers = [];
  }

  sendAmount() {
    let data = {
      "sender": "5bd2de33c1d90124a76e0185",
      "receiver": this.selectedReceiver._id,
      "amount": "4.5",
      "fee": "1.1",
      "walletAmount": "1",
      "walletFee": "0.2"
    }

    this.walletService.makePayment(data).subscribe(data => {
      console.log(data);
    }, err => {
      console.log(err);
    })

  }

}
