import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileService } from '../../profile.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

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
    filesToUpload: Array<File> = [];
    fi;
    @ViewChild('fileInput') fileInput;

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
        private _profileService: ProfileService,
        public snackBar: MatSnackBar,
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
    }

    // blobToBase64(blob, (base64) => { // encode
    //     var update = { 'blob': base64 };
    //     $http.post('/api/save_recording', update)
    //         .success(function (new_recording) {
    //             console.log("success");
    //         });
    // });

    uploadFile(): void {
        if (this.fi.files && this.fi.files[0]) {
            const fileToUpload = this.fi.files[0];
            // const input = new FormData();
            // input.append('file', fileToUpload);

            this._profileService.addFile(fileToUpload).subscribe(res => {
                if (res.sucess) {
                    this.snackBar.open('Success', res.message, {
                        duration: 5000,
                        horizontalPosition: 'center',
                        verticalPosition: 'top'
                    });
                } else {
                    this.snackBar.open('Error', res.message, {
                        duration: 5000,
                        horizontalPosition: 'center',
                        verticalPosition: 'top'
                    });
                }
            }, error => {
                this.snackBar.open('Error', 'Please try again sometime. File was not uploaded.', {
                    duration: 5000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                });
            });
        }


    }

    fileChangeEvent(fileInput: any) {
        // this.filesToUpload = <Array<File>>fileInput.target.files;
        this.fi = this.fileInput.nativeElement;

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
