import { TestBed, inject } from '@angular/core/testing';

import { StockDetailService } from './stock-detail.service';

describe('StockDetailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StockDetailService]
    });
  });

  it('should be created', inject([StockDetailService], (service: StockDetailService) => {
    expect(service).toBeTruthy();
  }));
});
