import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss'],
  animations: fuseAnimations
})
export class StockDetailComponent implements OnInit {
  groupId;
  stockName: string;
  stockId: string;
  constructor(private route: ActivatedRoute,
    private router: Router, ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.stockId = params['stockId'];
      this.groupId = params['groupId'];
      this.stockName = params['stockname'];
    });
  }
}
