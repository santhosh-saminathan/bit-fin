import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  lineChartData: any;
  lineChartLabels: any;
  lineChartColors: any;

  constructor() { }

  // lineChart

  public lineChartOptions: any = {
    responsive: true,
    scales: {
      yAxes: [
      { ticks: { min: 0, stepValue: 10, max: 100 },
      scaleLabel: {
        display: true,
        labelString: 'probability'
      } }]
    }
  };

  public lineChartLegend: boolean = false;
  public lineChartType: string = 'line';

  ngOnInit() {
    this.lineChartData = [
      { data: [65, 59, 80, 81, 56, 55, 40, 54, 54, 54, 45], label: 'XLM Rate flow' },
    ];

    this.lineChartLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'G', 'G', 'v', 'G'];


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

  }

}
