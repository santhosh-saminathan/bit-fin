import { Component, OnInit } from '@angular/core';
import { TransactionService } from './../services/transaction.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  sentTransactions: any;
  receivedTransactions: any;
  depositTransactions: any;
  withdrawTransactions: any;
  noContent: boolean = true;

  constructor(public toastr: ToastrService, private transactionService: TransactionService) { }


  ngOnInit() {

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
    }, err => {
      this.toastr.error('Failed to get deposit transaction data', 'Error!');
    })

    this.transactionService.withdrawTransactions().subscribe(data => {
      this.withdrawTransactions = data;
    }, err => {
      this.toastr.error('Failed to get withdraw transaction data', 'Error!');
    })
  }

}
