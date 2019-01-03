import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WalletService } from './../services/wallet.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ProfileService } from './../services/profile.service';
import { CryptoService } from './../services/crypto.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./../transactions/bootstrap.css', './wallet.component.css']
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
  userDetails: any;
  withdraw: any = {};
  withdrawBankDetails: any;
  noContent: boolean = true;

  //deposit
  cardData: any = {};

  //send
  sendTransactionTotal: any = 0;
  sendTransactionFee: any = 0;
  sendWalletAmount_USD: any = 0;
  sendWalletFee_USD: any = 0;
  waitingForResponse: boolean = false;

  //withdraw
  amountToWithdraw: any = 0;
  withdrawTransactionFee: any = 0;
  withdrawAmount_xlm: any = 0;
  withdrawRate: any = 0
  withdrawFee: any = 0;
  selectedWithdrawAccount: any;

  //deposit
  amountToDeposit: any = 0;
  uploadVerificationImage: any;
  cardYear: any = [];
  cardMonth: any = [];
  showFailureAlert: boolean = false;
  showSuccessAlert: boolean = false;


  constructor(private route: ActivatedRoute, public toastr: ToastrService, private walletService: WalletService, private fb: FormBuilder, private profileService: ProfileService, private cryptoService: CryptoService) { }


  getBalance() {
    this.profileService.getBalance().subscribe(data => {
      this.availableBalance = data;
      this.noContent = false;
      if (this.route.snapshot.queryParams['type'] && this.route.snapshot.queryParams['type'] == "receive") {
        this.showReceive();
      }

      if (this.route.snapshot.queryParams['type'] && this.route.snapshot.queryParams['type'] == "deposit") {
        this.showDeposit();
      }



    }, err => {
      this.toastr.error('Failed to get user balance data', 'Error!');
    });
  }

  ngOnInit() {


    let presentYear = new Date().getFullYear();

    this.cardYear = [presentYear, presentYear + 1, presentYear + 2, presentYear + 3, presentYear + 4, presentYear + 5, presentYear + 6, presentYear + 7, presentYear + 8, presentYear + 9, presentYear + 10, presentYear + 11, presentYear + 12]
    this.cardMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    this.cardData.cardNumber = 4242424242424242;
    this.cardData.saveCard = false;
    this.withdraw.saveDetails = false;
    this.withdraw.routingNumber = '110000000';
    this.withdraw.accountNumber = '000123456789';
    this.withdraw.accountHolder = 'Jenny';
    this.withdraw.postalCode = '10001';

    this.getBalance();

    this.profileService.getUserDetails().subscribe(data => {
      this.userDetails = data;
      this.yourMobileNumber = this.userDetails.mobile_number;


    }, err => {
      this.toastr.error('Failed to get user details', 'Error!');
    });


    this.walletService.getAdminDetails().subscribe(data => {
      this.adminDetails = data;
    }, err => {
      this.toastr.error('Failed to get Admin details', 'Error!');
    })

    this.cryptoService.getUsdToXlm().subscribe(data => {
      this.usd_xlm_conversion = data;
      this.usd_xlm_conversion = this.usd_xlm_conversion.XLM;
    }, err => {
      this.toastr.error('Failed to get usd to xlm conversion details', 'Error!');
    })

    this.cryptoService.getXlmToUsd().subscribe(data => {
      this.xlm_Usd_conversion = data;
      this.xlm_Usd_conversion = this.xlm_Usd_conversion.USD;
    }, err => {
      this.toastr.error('Failed to get xlm to usd conversion details', 'Error!');
    })

    this.savedDetails();







  }


  showDeposit() {
    $("#sendTab").removeClass('active');
    $("#depositTab").addClass('active');

    $("#send").removeClass('in active');
    $("#deposit").addClass('in active');
  }

  showReceive() {
    $("#receiveTab").addClass('active');
    $("#sendTab").removeClass('active');

    $("#receive").addClass('in active');
    $("#send").removeClass('in active');
  }


  savedDetails() {
    this.walletService.userSavedCardDetails().subscribe(data => {
      this.savedCards = data;
    }, err => {
      this.toastr.error('Failed to get saved card details', 'Error!');
    })

    this.walletService.savedWithdrawBankDetails().subscribe(data => {
      this.withdrawBankDetails = data;
    }, err => {
      this.toastr.error('Failed to get saved withdraw bank details', 'Error!');
    })
  }

  selectedCard(card) {
    this.savedCards.forEach(element => {
      element.selected = false;

    });
    console.log(card);
    this.cardData.cvv = null;
    card.selected = true;
    this.cardData.cardHolder = card.holder
    this.cardData.cardNumber = card.number
    this.cardData.month = card.expiry.includes('/') ? card.expiry.split('/')[0] : card.expiry.split('-')[0]
    this.cardData.year = card.expiry.includes('/') ? card.expiry.split('/')[1] : card.expiry.split('-')[1]
  }

  createToken() {
    this.showSuccessAlert = false;
    this.showFailureAlert = false;

    if (this.amountToDeposit > 0 && this.cardData.cardHolder && this.cardData.cardNumber && this.cardData.month && this.cardData.year && this.cardData.cvv) {
      this.waitingForResponse = true;
      let that = this;
      (<any>window).Stripe.card.createToken({
        number: this.cardData.cardNumber,
        exp_month: this.cardData.month,
        exp_year: this.cardData.year,
        cvc: this.cardData.cvv
      }, (status: number, response: any) => {
        if (response.id) {
          let data = {
            "stripeToken": response.id,
            "saveCard": this.cardData.saveCard ? this.cardData.saveCard : false,
            "amount": this.amountToDeposit.toFixed(2),
            "user": localStorage.getItem('userId'),
            "xlmAmount": (this.amountToDeposit * this.usd_xlm_conversion).toFixed(2),
            "card": {
              "number": this.cardData.cardNumber.toString(),
              "holder": this.cardData.cardHolder,
              "expiry": this.cardData.month + '-' + this.cardData.year,
              "user": localStorage.getItem('userId'),
            }
          }

          this.walletService.depositAmount(data).subscribe(data => {
            this.toastr.success('Deposit amount successfully', '', {
              timeOut: 100
            });
            this.waitingForResponse = false;
            this.amountToDeposit = 0;
            this.showSuccessAlert = true;
            this.cardData = {};
            window.scroll(0, 0);
            this.getBalance();
            this.savedDetails();
          }, err => {
            this.toastr.error('Failed to deposit amount', 'Error!');

            this.cardData = {};
            this.waitingForResponse = false;
            window.scroll(0, 0);
            this.showFailureAlert = true;
          })

        } else {
          this.toastr.error('Invalid card details', 'Error!', {
            timeOut: 100
          });
          this.waitingForResponse = false;
          this.cardData = {};
        }
      }, (err) => {
        this.waitingForResponse = false;
        this.toastr.error('Invalid card details', 'Error!');
      });
    } else {
      this.toastr.error('Enter deposit amount and card details', 'Error!');
    }
  }

  // depositAmount(data) {

  // }


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

    if (this.amountToSend < 0) {
      this.toastr.error('Negative values not accepted', 'Error!');
    } else {
      this.amountToSend ? this.amountToSend : this.amountToSend = 0;

      let xlmAmount = parseFloat(this.amountToSend) * parseFloat(this.usd_xlm_conversion);
      this.sendTransactionTotal = xlmAmount + ((xlmAmount * this.adminDetails.sendTransactionFee) / 100);
      this.sendTransactionFee = (xlmAmount * this.adminDetails.sendTransactionFee) / 100

      this.sendWalletAmount_USD = this.sendTransactionTotal * parseFloat(this.xlm_Usd_conversion);
      this.sendWalletFee_USD = this.sendTransactionFee * parseFloat(this.xlm_Usd_conversion);

      this.sendTransactionTotal = this.sendTransactionTotal.toFixed(2);
      this.sendTransactionFee = this.sendTransactionFee.toFixed(2);

      this.sendWalletAmount_USD = this.sendWalletAmount_USD.toFixed(2);
      this.sendWalletFee_USD = this.sendWalletFee_USD.toFixed(2);

    }



  }

  sendAmount() {

    let count = 0;
    let isNumberRegistered = false;

    if (this.autocompleteNumbers) {
      this.autocompleteNumbers.forEach(element => {
        count++
        if (element.mobile_number === this.receiverMobileNumber) {
          isNumberRegistered = true;
        }
      });
    }



    let data = {
      "sender": localStorage.getItem('userId'),
      "receiver": this.selectedReceiver ? this.selectedReceiver._id : null,
      "amount": this.sendTransactionTotal,
      "fee": this.sendTransactionFee,
      "walletAmount": this.sendWalletAmount_USD,
      "walletFee": this.sendWalletFee_USD
    }

    if (isNumberRegistered) {
      this.toastr.error('This number is not registered', 'Error!');
    } else if (parseFloat(this.sendWalletAmount_USD) > (parseFloat(this.availableBalance[0].balance) * parseFloat(this.xlm_Usd_conversion))) {
      this.toastr.error('Total amount should be less than your balance', 'Error!');
    } else if (data.sender == data.receiver) {
      this.toastr.error('Sender and Receiver cannot be same', 'Error!');
    } else if (this.amountToSend > 0 && data.sender && data.receiver && data.amount && data.fee && data.walletAmount && data.walletFee) {

      this.waitingForResponse = true;
      this.walletService.makePayment(data).subscribe(data => {
        this.waitingForResponse = false;
        this.amountToSend = 0;
        this.sendWalletAmount_USD = 0;
        this.sendWalletFee_USD = 0;

        this.toastr.success('Payment sent successfully');
        this.getBalance();
      }, err => {
        this.waitingForResponse = false;
        this.toastr.error('Error while sending payment', 'Error!');
      })
    } else {
      this.toastr.error('Some fields are missing', 'Error!');
    }
  }


  //withdraw
  selectedWithdrawBankDetails(bankData) {
    this.withdrawBankDetails.forEach(element => {
      element.selected = false;
    });

    bankData.selected = true;
    this.selectedWithdrawAccount = bankData;
  }

  withdrawProof($event) {
    this.waitingForResponse = true;
    let file = $event.target.files[0];
    const myReader: FileReader = new FileReader();
    myReader.onloadend = (loadEvent: any) => {
      let image = loadEvent.target.result.split('base64,')[1];
      this.profileService.uploadImage({ 'image': image }).subscribe(data => {
        this.uploadVerificationImage = data;
        if (this.uploadVerificationImage) {
          this.waitingForResponse = false;
          this.withdraw.verificationFile = this.uploadVerificationImage.url;
          this.toastr.success('Verification proof uploaded', 'Success!');
        } else {
          this.toastr.error('Error while uploading image', 'Error!');
        }
      }, err => {
        this.toastr.error('Error while uploading image', 'Error!');
      })
    };
    myReader.readAsDataURL(file);
  }

  calculateWithdrawFee() {
    this.withdrawAmount_xlm = parseFloat(this.amountToWithdraw) * parseFloat(this.usd_xlm_conversion);
    this.withdrawRate = (this.withdrawAmount_xlm * parseFloat(this.adminDetails.sellRate)) / 100;
    var updatedAmount = this.withdrawAmount_xlm + this.withdrawRate;
    this.withdrawFee = (updatedAmount * parseFloat(this.adminDetails.sellTransactionFee)) / 100;
    this.withdrawTransactionFee = (this.withdrawRate + this.withdrawFee) * parseFloat(this.xlm_Usd_conversion);
  }

  withdrawToSelectedAccount() {

    if (this.amountToWithdraw > 0 && this.selectedWithdrawAccount && this.amountToWithdraw < (parseFloat(this.availableBalance[0].balance) * parseFloat(this.xlm_Usd_conversion))) {
      this.selectedWithdrawAccount.usd = this.amountToWithdraw.toFixed(2);
      this.selectedWithdrawAccount.xlm = this.withdrawAmount_xlm.toFixed(2)
      this.selectedWithdrawAccount.fee = this.withdrawFee.toFixed(2);
      this.selectedWithdrawAccount.rate = this.withdrawRate.toFixed(2);
      this.selectedWithdrawAccount.walletFee = this.withdrawTransactionFee.toFixed(2);

      this.waitingForResponse = true;
      this.walletService.withdrawFromAccount(this.selectedWithdrawAccount).subscribe(data => {
        this.waitingForResponse = false;
        this.amountToWithdraw = null;
        this.toastr.success('Withdraw amount successfully');
        this.getBalance();
      }, err => {
        this.waitingForResponse = false;
        this.toastr.error('Error while withdraw amount', 'Error!');
      })
    } else {
      this.toastr.error('Enter Proper withdraw Amount and Select Bank', 'Error!');
    }



  }

  withdrawToNewAmount() {

    let validMobile = false;
    let validSSN = false;
    let validDOB = false;
    let validWithdrawAmount = false;

    if (this.withdraw.phoneNumber && this.withdraw.phoneNumber.length == 10) {
      validMobile = true;
    } else {
      this.toastr.error('Mobile number should be 10 digits', 'Error!');
    }

    if (this.withdraw.ssn && this.withdraw.ssn.length == 4) {
      validSSN = true;
    } else {
      this.toastr.error('SSN number should be 4 digits', 'Error!');
    }

    if (this.withdraw.dob.split('-')[0] <= 12 && this.withdraw.dob.split('-')[1] <= 31 && this.withdraw.dob.split('-')[2] < new Date().getFullYear() && this.withdraw.dob.split('-')[2] > 1900) {

      let years = new Date().getFullYear() - parseInt(this.withdraw.dob.split('-')[2]);
      if (years >= 18 && years <= 100) {
        validDOB = true;
      } else {
        this.toastr.error('Age should be more than 18 years', 'Error!');
      }
    } else {
      this.toastr.error('Invalid Date format', 'Error!');
    }

    // let years = Math.abs(new Date().getFullYear() - new Date(this.withdraw.dob).getFullYear());

    // if (years > 18 && years < 100) {
    //   validDOB = true;
    // } else {
    //   this.toastr.error('Age should be more than 18 years', 'Error!');
    // }


    if (this.amountToWithdraw < (parseFloat(this.availableBalance[0].balance) * parseFloat(this.xlm_Usd_conversion))) {
      validWithdrawAmount = true;
    }

    if (validWithdrawAmount && validMobile && validSSN && validDOB) {
      if (this.amountToWithdraw > 0 &&
        this.withdraw.routingNumber && this.withdraw.accountNumber && this.withdraw.phoneNumber && this.withdraw.accountHolder
        && this.withdraw.firstName && this.withdraw.lastName && this.withdraw.line1 && this.withdraw.line2
        && this.withdraw.state && this.withdraw.city && this.withdraw.postalCode && this.withdraw.ssn) {

        this.withdraw.day = new Date(this.withdraw.dob.toString()).getDate();
        this.withdraw.month = new Date(this.withdraw.dob.toString()).getMonth() + 1;
        this.withdraw.year = new Date(this.withdraw.dob.toString()).getFullYear();

        this.withdraw.day = this.withdraw.day.toString();
        this.withdraw.accountNumber = this.withdraw.accountNumber.toString();
        this.withdraw.month = this.withdraw.month.toString();
        this.withdraw.phoneNumber = this.withdraw.phoneNumber.toString();
        this.withdraw.saveDetails = this.withdraw.saveDetails;
        this.withdraw.ssn = this.withdraw.ssn.toString();
        this.withdraw.year = this.withdraw.year.toString();

        this.withdraw.usd = this.amountToWithdraw.toFixed(2);
        this.withdraw.xlm = this.withdrawAmount_xlm.toFixed(2)
        this.withdraw.fee = this.withdrawFee.toFixed(2);
        this.withdraw.rate = this.withdrawRate.toFixed(2);
        this.withdraw.walletFee = this.withdrawTransactionFee.toFixed(2);


        this.waitingForResponse = true;
        this.walletService.withdrawFromAccount(this.withdraw).subscribe(data => {
          this.amountToWithdraw = 0;
          this.toastr.success('Withdraw amount successfully');
          this.getBalance();
          this.savedDetails();
          this.waitingForResponse = false;
        }, err => {
          this.waitingForResponse = false;
          this.toastr.error('Error while withdraw amount', 'Error!');
        })
      } else {
        this.toastr.error('Some fileds are missing', 'Error!');
      }
    }



  }

}
