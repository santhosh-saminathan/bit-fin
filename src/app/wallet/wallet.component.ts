import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WalletService } from './../services/wallet.service';
// import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ProfileService } from './../services/profile.service';
import { CryptoService } from './../services/crypto.service';
import { ToastrService } from 'ngx-toastr';


import { StripeService, StripeCardComponent, ElementOptions, ElementsOptions } from "ngx-stripe";

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  yourMobileNumber: any;
  savedCards: any;
  receiverMobileNumber: any;
  autocompleteNumbers: any;
  availableBalance: any;
  selectedReceiver: any;
  amountToSend: any = 0;
  feePercentage: any = 0.1;
  adminDetails: any;
  usd_xlm_conversion: any = 0;
  xlm_Usd_conversion: any = 0;
  transactionFee: any = 0;
  userDetails: any;
  withdraw: any = {};
  withdrawBankDetails:any;

  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  cardOptions: ElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        lineHeight: '40px',
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: ElementsOptions = {
    locale: 'en'
  };

  stripeTest: FormGroup;

  constructor(public toastr: ToastrService, private walletService: WalletService, private fb: FormBuilder, private stripeService: StripeService, private profileService: ProfileService, private cryptoService: CryptoService) { }

  // constructor(private walletService: WalletService, private profileService: ProfileService, private cryptoService: CryptoService) { }

  ngOnInit() {

    this.withdraw.saveDetails = true;

    this.profileService.getBalance().subscribe(data => {
      this.availableBalance = data;
      console.log("user balance",data);
    }, err => {
      this.toastr.error('Failed to get user balance data', 'Error!');
    });

    this.profileService.getUserDetails().subscribe(data => {
      console.log("user details",data);
      this.userDetails = data;
      this.yourMobileNumber = this.userDetails.mobile_number;
    }, err => {
      this.toastr.error('Failed to get user details', 'Error!');
    });


    this.walletService.getAdminDetails().subscribe(data => {
      console.log("admin data",data);
      this.adminDetails = data;
    }, err => {
      this.toastr.error('Failed to get Admin details', 'Error!');
    })

    this.cryptoService.getUsdToXlm().subscribe(data => {
      console.log("usd to xlm",data);
      this.usd_xlm_conversion = data;
      this.usd_xlm_conversion = this.usd_xlm_conversion.XLM;
    }, err => {
      this.toastr.error('Failed to get usd to xlm conversion details', 'Error!');
    })

    this.cryptoService.getXlmToUsd().subscribe(data => {
      console.log("xlm to usd",data);
      this.xlm_Usd_conversion = data;
      this.xlm_Usd_conversion = this.xlm_Usd_conversion.USD;
    }, err => {
      this.toastr.error('Failed to get xlm to usd conversion details', 'Error!');
    })

    this.walletService.userSavedCardDetails().subscribe(data => {
      console.log("card details",data);
      this.savedCards = data;
    }, err => {
      this.toastr.error('Failed to saved card details', 'Error!');
    })

    this.walletService.savedWithdrawBankDetails().subscribe(data => {
      console.log("withdraw bank details",data);
      this.withdrawBankDetails = data;
    }, err => {
      this.toastr.error('Failed to get ', 'Error!');
    })

    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });


  }


  buy() {
    console.log(this.stripeTest.get('name').value, this.card.getCard());

    const name = this.stripeTest.get('name').value;
    this.stripeService
      .createToken(this.card.getCard(), { name })
      .subscribe(result => {
        if (result.token) {
          // Use the token to create a charge or a customer
          // https://stripe.com/docs/charges
          console.log(result.token.id);
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
      });
  }

  selectedCard(card) {
    // console.log(card)
    card.selected = true;
  }

  getAutocompleteMobileNumbers() {
    this.walletService.autocompleteMobileNumber(this.receiverMobileNumber).subscribe((data) => {
      this.autocompleteNumbers = data;
    }, err => {
      this.toastr.error('Failed to mobile number for autocomplete', 'Error!');
    })
  }


  selectedMobileNumber(data) {
    this.selectedReceiver = data;
    this.receiverMobileNumber = this.selectedReceiver.mobile_number;
    this.autocompleteNumbers = [];
  }

  calculateFee() {
    this.transactionFee = 0;
    // console.log("user usd amount", this.amountToSend);
    // console.log("admin sell rate", parseFloat(this.adminDetails.sellRate));
    // console.log("admin sell transaction fee", parseFloat(this.adminDetails.sellTransactionFee));

    var amountToSendXlm = parseFloat(this.amountToSend) * parseFloat(this.usd_xlm_conversion);

    // console.log("xlm converison of usd amount", amountToSendXlm);

    var rate = (amountToSendXlm * parseFloat(this.adminDetails.sellRate)) / 100;
    console.log("rate", rate);
    var updatedAmount = amountToSendXlm + rate;
    console.log("updatedAmount", updatedAmount);
    var fee = (updatedAmount * parseFloat(this.adminDetails.sellTransactionFee)) / 100;
    console.log("Fee", fee);
    this.transactionFee = fee;
  }

  sendAmount() {
    let data = {
      "sender": localStorage.getItem('userId'),
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

  withdrawProof($event) {
    let file = $event.target.files[0];
    const myReader: FileReader = new FileReader();
    myReader.onloadend = (loadEvent: any) => {
      this.withdraw.verificationFile = loadEvent.target.result;
    };
    myReader.readAsDataURL(file);
  }

  withdrawAmount() {
    console.log(this.withdraw);
    console.log(this.withdraw.dob);

    this.withdraw.day = new Date(this.withdraw.dob.toString()).getDate();
    this.withdraw.month = new Date(this.withdraw.dob.toString()).getMonth() + 1;
    this.withdraw.year = new Date(this.withdraw.dob.toString()).getFullYear();


    // this.withdraw.usd =
    //   this.withdraw.xlm =
    //   this.withdraw.fee =
    //   this.withdraw.rate =
    //   this.withdraw.walletFee = 

    if (this.withdraw.walletFee && this.withdraw.rate && this.withdraw.fee && this.withdraw.xlm
      && this.withdraw.usd && this.withdraw.routingNumber && this.withdraw.accountNumber) {

      this.walletService.withdrawFromAccount(this.withdraw).subscribe(data => {
        console.log(data);
      }, err => {
        console.log(err);
      })
    }


  }

}
