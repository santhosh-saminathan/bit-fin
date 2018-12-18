import { Component, OnInit } from '@angular/core';
import { CryptoService } from './../services/crypto.service';
import { ProfileService } from './../services/profile.service';
import { TransactionService } from './../services/transaction.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
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

  constructor(private transactionService: TransactionService, private cryptoService: CryptoService, private profileService: ProfileService) { }

  // lineChart

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
      console.log(data);
      this.usd_Xlm = data;
    }, err => {
      console.log(err);
    })

    this.cryptoService.getXlmToUsd().subscribe(data => {
      console.log(data);
      this.xlm_Usd = data;
    }, err => {
      console.log(err);
    })

    this.profileService.getBalance().subscribe(data => {
      console.log(data);
      this.userBalanceResponse = data;
      this.userBalance = this.userBalanceResponse[0].balance;
    }, err => {
      console.log(err);
    })

    this.transactionService.sentTransactions().subscribe(data => {
      console.log(data);
      this.sentTransactions = data;
    }, err => {
      console.log(err);
    })

    this.cryptoService.getRateFlow().subscribe(data => {
      // console.log(data);
      this.rateFlow = data;
      if (this.rateFlow.Response === "Success") {

        this.lineChartColors = [
          { // grey
            backgroundColor: '#f2efff',
            borderColor: '#417af8',
            pointBackgroundColor: 'rgb(71, 71, 243)',
            pointBorderColor: 'blue',
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
          let time = new Date(element.time * 1000).getDate() + "/" + new Date(element.time * 1000).getMonth() + " " + new Date(element.time * 1000).getHours() + ":" + new Date(element.time * 1000).getMinutes();
          console.log(time);
          this.lineChartLabels.push(time)
        });

      }
    }, err => {
      console.log(err);
    })




  }

}
