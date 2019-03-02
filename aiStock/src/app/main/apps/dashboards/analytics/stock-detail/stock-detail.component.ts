import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { StockDetailService } from './stock-detail.service';
import { from } from 'rxjs';
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
  widget1SelectedYear = '2016';
  widget5SelectedDay = 'today';
  constructor(private route: ActivatedRoute,
    private router: Router, public _stockDetailService: StockDetailService) {
    this._registerCustomChartJSPlugin();
  }

  ngOnInit() {
    // Get the widgets from the service
    this.widgets = this._stockDetailService.widgets;
    this.route.params.subscribe(params => {
      this.stockId = params['stockId'];
      this.groupId = params['groupId'];
      this.stockName = params['stockname'];
    });
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
}
