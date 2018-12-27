import { Component, OnInit } from '@angular/core';
import { TransactionService } from './../services/transaction.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./bootstrap.css', './transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  sentTransactions: any;
  receivedTransactions: any;
  depositTransactions: any;
  withdrawTransactions: any;
  noContent: boolean = true;
  modal: any = {};
  pageNo1: any = 1;
  pageNo2: any = 1;
  pageNo3: any = 1;
  pageNo4: any = 1;

  constructor(private route: ActivatedRoute,public toastr: ToastrService, private transactionService: TransactionService) { }


  ngOnInit() {

    // console.log(this.route.snapshot.queryParams['type']);

  

    this.transactionService.sentTransactions().subscribe(data => {
      this.sentTransactions = data;
      this.noContent = false;
    }, err => {
      this.toastr.error('Failed to get sent transaction data', 'Error!');
    })

    this.transactionService.receivedTransactions().subscribe(data => {
      this.receivedTransactions = data;
    }, err => {
      this.toastr.error('Failed to get received transaction data', 'Error!');
    })

    this.transactionService.depositTransactions().subscribe(data => {
      this.depositTransactions = data;

      if(this.route.snapshot.queryParams['type'] && this.route.snapshot.queryParams['type']=="deposit" ){
        console.log("called");
       this.showDepositTransaction();
      }
      
    }, err => {
      this.toastr.error('Failed to get deposit transaction data', 'Error!');
    })

    this.transactionService.withdrawTransactions().subscribe(data => {
      this.withdrawTransactions = data;
    }, err => {
      this.toastr.error('Failed to get withdraw transaction data', 'Error!');
    })
  }

  showDepositTransaction(){
    $("#depositTab").addClass('active');
    $("#sendTab").removeClass('active');

    $("#deposit").addClass('in active');
    $("#send").removeClass('in active');

  }

  modalData(data, title) {
    if(title == 'Sent Transaction Detail'){
      this.modal.type="sent"
      this.modal.title = title;
      this.modal.createdTime = data.createdTs;
      this.modal.receiver = data.receiver.firstName + data.receiver.lastName;
      this.modal.amount = data.walletAmount;
      this.modal.fee = data.walletFee;
      this.modal.total = parseFloat(data.walletAmount)+parseFloat(data.walletFee);
    }
    if(title == 'Received Transaction Detail'){
      this.modal.type="received"
      this.modal.title = title;
      this.modal.createdTime = data.createdTs;
      this.modal.receiver = data.sender.firstName + data.sender.lastName;
      this.modal.fee = null;
      this.modal.amount = data.walletAmount;
      this.modal.total =  data.walletAmount;
    }

    if(title == 'Deposit Transaction Detail'){
      this.modal.type="deposited"
      this.modal.title = title;
      this.modal.createdTime = data.createdTs;
      this.modal.receiver = null;
      this.modal.fee = null;
      this.modal.amount = data.amount;
      this.modal.total =  data.amount;
    }
    if(title == 'Withdraw Transaction Detail'){
      this.modal.type="withdrawn"
      this.modal.title = title;
      this.modal.createdTime = data.createdTs;
      this.modal.receiver =null;
      this.modal.fee = null;
      this.modal.amount = data.received;
      this.modal.total =  data.received;
    }
   
  }

}
