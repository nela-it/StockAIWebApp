import { Component, OnInit } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss'],
  animations: fuseAnimations
})
export class StockDetailComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
