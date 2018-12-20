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
  withdrawBankDetails: any;

  //send
  sendTransactionTotal: any = 0;
  sendTransactionFee: any = 0;
  sendWalletAmount_USD: any = 0;
  sendWalletFee_USD: any = 0;
  waitingForResponse:boolean = false;

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
      console.log("user balance", data);
    }, err => {
      this.toastr.error('Failed to get user balance data', 'Error!');
    });

    this.profileService.getUserDetails().subscribe(data => {
      console.log("user details", data);
      this.userDetails = data;
      this.yourMobileNumber = this.userDetails.mobile_number;
    }, err => {
      this.toastr.error('Failed to get user details', 'Error!');
    });


    this.walletService.getAdminDetails().subscribe(data => {
      console.log("admin data", data);
      this.adminDetails = data;
    }, err => {
      this.toastr.error('Failed to get Admin details', 'Error!');
    })

    this.cryptoService.getUsdToXlm().subscribe(data => {
      console.log("usd to xlm", data);
      this.usd_xlm_conversion = data;
      this.usd_xlm_conversion = this.usd_xlm_conversion.XLM;
    }, err => {
      this.toastr.error('Failed to get usd to xlm conversion details', 'Error!');
    })

    this.cryptoService.getXlmToUsd().subscribe(data => {
      console.log("xlm to usd", data);
      this.xlm_Usd_conversion = data;
      this.xlm_Usd_conversion = this.xlm_Usd_conversion.USD;
    }, err => {
      this.toastr.error('Failed to get xlm to usd conversion details', 'Error!');
    })

    this.walletService.userSavedCardDetails().subscribe(data => {
      console.log("card details", data);
      this.savedCards = data;
    }, err => {
      this.toastr.error('Failed to saved card details', 'Error!');
    })

    this.walletService.savedWithdrawBankDetails().subscribe(data => {
      console.log("withdraw bank details", data);
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

  calculateSendFee() {



    this.transactionFee = 0;
    let xlmAmount = parseFloat(this.amountToSend) * parseFloat(this.usd_xlm_conversion);
    this.sendTransactionTotal = xlmAmount + ((xlmAmount * this.adminDetails.sendTransactionFee) / 100);
    this.sendTransactionFee = (xlmAmount * this.adminDetails.sendTransactionFee) / 100

    this.sendWalletAmount_USD = this.sendTransactionTotal * parseFloat(this.xlm_Usd_conversion);
    this.sendWalletFee_USD = this.sendTransactionFee * parseFloat(this.xlm_Usd_conversion);

    this.sendTransactionTotal = this.sendTransactionTotal.toFixed(2);
    this.sendTransactionFee = this.sendTransactionFee.toFixed(2);

    this.sendWalletAmount_USD = this.sendWalletAmount_USD.toFixed(2);
    this.sendWalletFee_USD = this.sendWalletFee_USD.toFixed(2);

    // var amountToSendXlm = parseFloat(this.amountToSend) * parseFloat(this.usd_xlm_conversion);


    // var rate = (amountToSendXlm * parseFloat(this.adminDetails.sellRate)) / 100;
    // console.log("rate", rate);
    // var updatedAmount = amountToSendXlm + rate;
    // console.log("updatedAmount", updatedAmount);
    // var fee = (updatedAmount * parseFloat(this.adminDetails.sellTransactionFee)) / 100;
    // console.log("Fee", fee);
    // this.transactionFee = fee;
  }

  sendAmount() {

    let data = {
      "sender": localStorage.getItem('userId'),
      "receiver": this.selectedReceiver ? this.selectedReceiver._id : null,
      "amount": this.sendTransactionTotal,
      "fee": this.sendTransactionFee,
      "walletAmount": this.sendWalletAmount_USD,
      "walletFee": this.sendWalletFee_USD
    }

    if (data.sender == data.receiver) {
      this.toastr.error('Sender and Receiver cannot be same', 'Error!');
    } else if (data.sender && data.receiver && data.amount && data.fee && data.walletAmount && data.walletFee) {
      this.amountToSend = null;
      this.waitingForResponse = true;
      this.walletService.makePayment(data).subscribe(data => {
        this.waitingForResponse = false;
        this.sendWalletAmount_USD = null;
        this.sendWalletFee_USD = null;
        this.ngOnInit();
        this.toastr.success('Payment sent successfully');
      }, err => {
        this.waitingForResponse = false;
        this.toastr.error('Error while sending payment', 'Error!');
      })
    } else {
      this.toastr.error('Some fields are missing', 'Error!');
    }



  }

  withdrawProof($event) {
    let file = $event.target.files[0];
    const myReader: FileReader = new FileReader();
    myReader.onloadend = (loadEvent: any) => {
      this.withdraw.verificationFile = loadEvent.target.result;
    };
    myReader.readAsDataURL(file);
  }

  selectedWithdrawAccount(data) {
    console.log(data)
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
