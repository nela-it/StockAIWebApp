import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationServiceService {

  constructor() { }
  emailValidator(control) {
    // RFC 2822 compliant regex
    if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
        return null;
    } else {
        //console.log('false')
        return { 'invalidEmailAddress': true };
    }
  }
}
