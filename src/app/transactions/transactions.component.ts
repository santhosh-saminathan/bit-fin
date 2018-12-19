import { Component, OnInit } from '@angular/core';
import { TransactionService } from './../services/transaction.service';

// import { ToastrService } from 'ngx-toastr';


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

  constructor(private transactionService: TransactionService) { }


  ngOnInit() {

    this.transactionService.sentTransactions().subscribe(data => {
      console.log(data);
      this.sentTransactions = data;
      this.noContent = false;
    }, err => {
      console.log(err);
    })

    this.transactionService.receivedTransactions().subscribe(data => {
      console.log(data);
      this.receivedTransactions = data;
    }, err => {
      console.log(err);
    })

    this.transactionService.depositTransactions().subscribe(data => {
      console.log(data);
      this.depositTransactions = data;
    }, err => {
      console.log(err);
    })

    this.transactionService.withdrawTransactions().subscribe(data => {
      console.log(data);
      this.withdrawTransactions = data;
    }, err => {
      console.log(err);
    })
  }

}
