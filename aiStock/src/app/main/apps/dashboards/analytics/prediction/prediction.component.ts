import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, from } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { Prediction } from './prediction.model';
import { PredictionService } from './prediction.service';
import { predictionStatuses } from './prediction-statuses';


@Component({
    selector: 'prediction-list',
    templateUrl: './prediction.component.html',
    styleUrls: ['./prediction.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PredictionListComponent implements OnInit, OnDestroy {
    prediction: Prediction;
    predictionStatuses: any;
    statusForm: FormGroup;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {PredictionService} _PredictionService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _PredictionService: PredictionService,
        private _formBuilder: FormBuilder
    ) {
        // Set the defaults
        this.prediction = new Prediction();
        this.predictionStatuses = predictionStatuses;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to update prediction on changes
        this._PredictionService.onPredictionChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(prediction => {
                this.prediction = new Prediction(prediction);
            });

        this.statusForm = this._formBuilder.group({
            newStatus: ['']
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update status
     */
    updateStatus(): void {
        const newStatusId = Number.parseInt(this.statusForm.get('newStatus').value);

        if (!newStatusId) {
            return;
        }

        const newStatus = this.predictionStatuses.find((status) => {
            return status.id === newStatusId;
        });

        newStatus['date'] = new Date().toString();

        this.prediction.status.unshift(newStatus);
    }
}
