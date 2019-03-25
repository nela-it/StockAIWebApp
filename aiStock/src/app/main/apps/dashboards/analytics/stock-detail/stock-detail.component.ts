import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { StockDetailService } from './stock-detail.service';
import { from } from 'rxjs';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material';
@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss'],
  animations: fuseAnimations
})
export class StockDetailComponent implements OnInit {
  groupId;
  widgets: any;
  stockName: string;
  stockId: string;
  stockData: any = [];
  algorithmData: any = [];
  errMsg: string;
  ticker: string;
  earningDate: string;
  suggestedDate: string;
  recommendedPrice: string;
  currentPrice: string;
  targetPrice: string;
  predictionGroup: string;
  tickerImage: string;
  alreadyAdded: string;
  todayChange: string;
  todayChangePercentage: string;
  id: string;
  widget1SelectedYear = '2016';
  widget5SelectedDay = 'today';
  constructor(private route: ActivatedRoute,
    private router: Router, public _stockDetailService: StockDetailService,
    public snackBar: MatSnackBar, ) {
    this._registerCustomChartJSPlugin();
  }

  ngOnInit() {
    // Get the widgets from the service
    this.widgets = this._stockDetailService.widgets;
    this.route.params.subscribe(params => {
      this.stockId = params['stockId'];
      this.groupId = params['groupId'];
      this.stockName = params['stockname'];
      this.alreadyAdded = params['portfolioFlag'];
    });
    // Stock Info  
    if (this._stockDetailService.stockInfo) {
      this.id = this._stockDetailService.stockInfo['id'];
      this.ticker = this._stockDetailService.stockInfo['ticker'];
      this.earningDate = this._stockDetailService.stockInfo['target_date'];
      this.suggestedDate = this._stockDetailService.stockInfo['suggested_date'];
      this.recommendedPrice = this._stockDetailService.stockInfo['recommended_price'];
      this.currentPrice = this._stockDetailService.stockInfo['real_time_price'].current_price;
      this.targetPrice = this._stockDetailService.stockInfo['target_price'];
      this.tickerImage = this._stockDetailService.stockInfo['ticker_image'];
      this.predictionGroup = this._stockDetailService.stockInfo['Prediction_group'].group_name;
      this.todayChange = this._stockDetailService.stockInfo['real_time_price'].today_change;
      this.todayChangePercentage = this._stockDetailService.stockInfo['real_time_price'].today_change_percentage;

    } else {
      this.errMsg = 'Stock Not Found';
      console.log(this.errMsg);
    }

    for (var j = 0; j < this._stockDetailService.algorithmInfo.length; j++) {
      if (this._stockDetailService.algorithmInfo[j].step_no === 1) {
        this._stockDetailService.algorithmInfo[j].stepChar = 'One';
        this._stockDetailService.algorithmInfo[j].stepColor = '#FF9D44';
      } else if (this._stockDetailService.algorithmInfo[j].step_no === 2) {
        this._stockDetailService.algorithmInfo[j].stepChar = 'Two';
        this._stockDetailService.algorithmInfo[j].stepColor = ' #45E792';
      } else if (this._stockDetailService.algorithmInfo[j].step_no === 3) {
        this._stockDetailService.algorithmInfo[j].stepChar = 'Three';
        this._stockDetailService.algorithmInfo[j].stepColor = '#00AFF0';
      } else if (this._stockDetailService.algorithmInfo[j].step_no === 4) {
        this._stockDetailService.algorithmInfo[j].stepChar = 'Four';
        this._stockDetailService.algorithmInfo[j].stepColor = '#FFDD67';
      }
    }
    this.algorithmData = this._stockDetailService.algorithmInfo;
  }
  private _registerCustomChartJSPlugin(): void {
    (<any>window).Chart.plugins.register({
      afterDatasetsDraw: function (chart, easing) {
        // Only activate the plugin if it's made available
        // in the options
        if (
          !chart.options.plugins.xLabelsOnTop ||
          (chart.options.plugins.xLabelsOnTop && chart.options.plugins.xLabelsOnTop.active === false)
        ) {
          return;
        }

        // To only draw at the end of animation, check for easing === 1
        const ctx = chart.ctx;

        chart.data.datasets.forEach(function (dataset, i) {
          const meta = chart.getDatasetMeta(i);
          if (!meta.hidden) {
            meta.data.forEach(function (element, index) {

              // Draw the text in black, with the specified font
              ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
              const fontSize = 13;
              const fontStyle = 'normal';
              const fontFamily = 'Roboto, Helvetica Neue, Arial';
              ctx.font = (<any>window).Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

              // Just naively convert to string for now
              const dataString = dataset.data[index].toString() + 'k';

              // Make sure alignment settings are correct
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              const padding = 15;
              const startY = 24;
              const position = element.tooltipPosition();
              ctx.fillText(dataString, position.x, startY);

              ctx.save();

              ctx.beginPath();
              ctx.setLineDash([5, 3]);
              ctx.moveTo(position.x, startY + padding);
              ctx.lineTo(position.x, position.y - padding);
              ctx.strokeStyle = 'rgba(255,255,255,0.12)';
              ctx.stroke();

              ctx.restore();
            });
          }
        });
      }
    });
  }

  addToPortfolioSubmit(stockId: string) {
    //console.log(stockId)
    if (stockId) {
      const stockid = {
        'stockId': stockId.toString()
      }
      this._stockDetailService.addToPortfolio(stockid).subscribe((result) => {

        this.snackBar.open('Success', 'Your porfolio successfully added.', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this._stockDetailService.toGetPredictions(this.groupId).subscribe((result) => {
          this._stockDetailService.alreadyAdded = 'true';
          // this._stockDetailService.predictions = result.data;
          //  this.dataSource = new FilesDataSource(this._predictionListService, this.paginator, this.sort);
          // window.location.reload();
        }, (err) => {
          console.log(err);
        });
      }, (err) => {
        console.log(err);
        if (err) {
          this.snackBar.open('Error', err.error.message, {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }
}
