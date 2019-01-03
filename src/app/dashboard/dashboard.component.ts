import { Component, OnInit } from '@angular/core';
import { CryptoService } from './../services/crypto.service';
import { ProfileService } from './../services/profile.service';
import { TransactionService } from './../services/transaction.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./../transactions/bootstrap.css', './dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  lineChartData: any;
  lineChartLabels: any;
  lineChartColors: any;
  usd_Xlm: any;
  xlm_Usd: any;
  userBalanceResponse: any;
  userBalance: any;
  rateFlow: any;
  sentTransactions: any;
  noContent: boolean = true;
  depositTransactions: any;
  modal: any = {};

  constructor(private router: Router, private activatedRoute: ActivatedRoute, public toastr: ToastrService, private transactionService: TransactionService, private cryptoService: CryptoService, private profileService: ProfileService) { }
  public lineChartOptions: any = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: { stepValue: 0.02 },
          scaleLabel: {
            display: true,
            labelString: 'USD value'
          }
        }],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Time'
          }
        }]
    }
  };
  public lineChartLegend: boolean = false;
  public lineChartType: string = 'line';

  ngOnInit() {

    this.cryptoService.getUsdToXlm().subscribe(data => {
      this.usd_Xlm = data;
    }, err => {
      this.toastr.error('Failed to get conversion data', 'Error!');
    })

    this.cryptoService.getXlmToUsd().subscribe(data => {
      this.xlm_Usd = data;
    }, err => {
      this.toastr.error('Failed to get conversion data', 'Error!');
    })

    this.profileService.getBalance().subscribe(data => {
      this.userBalanceResponse = data;
      this.userBalance = this.userBalanceResponse[0].balance;
      this.noContent = false;
    }, err => {
      this.toastr.error('Failed to get user balance', 'Error!');
    })

    this.transactionService.sentTransactions().subscribe(data => {
      this.sentTransactions = data;
    }, err => {
      this.toastr.error('Failed to get user transactiona', 'Error!');
    })

    this.transactionService.depositTransactions().subscribe(data => {
      this.depositTransactions = data;
    }, err => {
      this.toastr.error('Failed to get deposit transaction data', 'Error!');
    })


    this.cryptoService.getRateFlow().subscribe(data => {
      this.rateFlow = data;
      if (this.rateFlow.Response === "Success") {

        this.lineChartColors = [
          {
            backgroundColor: '#f2efff',
            borderColor: '#151935',
            pointBackgroundColor: '#151935',
            pointBorderColor: '#151935',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)',
            fill: false,
          }
        ];
        this.lineChartData = [
          { data: [], label: 'XLM Rate flow' },
        ];
        this.lineChartLabels = [];
        this.rateFlow.Data.forEach(element => {
          this.lineChartData[0].data.push(element.close);
          let time = new Date(element.time * 1000).getDate() + "/" + (new Date(element.time * 1000).getMonth() + 1) + " " + new Date(element.time * 1000).getHours() + ":" + new Date(element.time * 1000).getMinutes();
          this.lineChartLabels.push(time)
        });

      }
    }, err => {
      this.toastr.error('Failed to get XLM Rate transactiona', 'Error!');
    })


  }

  redirectToTransactionPage() {
    this.router.navigate(['/transactions'])
  }

  redirectToTransactionPageDeposit() {
    this.router.navigate(['/transactions'], { queryParams: { type: 'deposit' } });
  }

  // wallet page
  redirectToWalletPage() {
    this.router.navigate(['/wallet']);
  }

  redirectToWalletPageDeposit() {
    this.router.navigate(['/wallet'], { queryParams: { type: 'deposit' } });
  }

  redirectToWalletPageReceive() {
    this.router.navigate(['/wallet'], { queryParams: { type: 'receive' } });
  }



  modalData(data, title) {
    if (title == 'Sent Transaction Detail') {
      this.modal.type = "sent"
      this.modal.title = title;
      this.modal.createdTime = data.createdTs;
      this.modal.receiver = data.receiver.firstName + data.receiver.lastName;
      this.modal.amount = data.walletAmount;
      this.modal.fee = data.walletFee;
      this.modal.total = parseFloat(data.walletAmount) + parseFloat(data.walletFee);
    }


    if (title == 'Deposit Transaction Detail') {
      this.modal.type = "deposited"
      this.modal.title = title;
      this.modal.createdTime = data.createdTs;
      this.modal.receiver = null;
      this.modal.fee = null;
      this.modal.amount = data.amount;
      this.modal.total = data.amount;
    }


  }


}
