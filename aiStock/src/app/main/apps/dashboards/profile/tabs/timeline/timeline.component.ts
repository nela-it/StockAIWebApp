import { Component, OnDestroy, OnInit } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileService } from '../../profile.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'profile-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss'],
    animations: fuseAnimations
})
export class ProfileTimelineComponent implements OnInit, OnDestroy {
    timeline: any;
    form: FormGroup;
    error: string;
    uploadResponse = { status: '', message: '', filePath: '' };
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ProfileService} _profileService
     */
    constructor(
        private formBuilder: FormBuilder,
        private _profileService: ProfileService
    ) {
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
        this._profileService.timelineOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(timeline => {
                this.timeline = timeline;
            });
        this.form = this.formBuilder.group({
            avatar: ['']
        });
    }
    readFile(e) {
        console.log(e)
        const file: File = e.target.files[0];
        this.form.get('avatar').setValue(file);
        console.log(file)
        console.log('size', file.size);
        console.log('type', file.type);
    }
    onSubmit() {
        //alert('jhiihiiiiii')
        const formData = new FormData();
        formData.append('file', this.form.get('avatar').value);
        console.log(formData);
        console.log(this.form.get('avatar').value);
        this._profileService.upload(formData).subscribe(
            (res) => console.log(res),
            (err) => this.error = err
        );
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}

/* interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
} */