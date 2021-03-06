import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {

  apiUrl = 'http://localhost:3000';

  constructor(public http: HttpClient) {
    console.log('Hello RestProvider Provider');
  }

    getLocation(pointNumber) {
      return new Promise(resolve => {
        this.http.get(this.apiUrl+'/locations/' + pointNumber).subscribe(data => {
          resolve(data);},
          err => {
            console.log(err);
          });
        });
      }
      
    }