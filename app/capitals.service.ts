import { Injectable, Inject } from '@angular/core';
import { Jsonp, Http, Response } from '@angular/http'

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class CapitalsService {

  constructor( @Inject(Http) private http: Http) {
    this.getCountries()
      .then(response => {
        this.countriesResponse = response;
        console.log(response);
      }).catch(err => console.log(err))
  }

  private countriesUrl = 'http://cors-anywhere.herokuapp.com/http://www.geognos.com/api/en/countries/info/all.json';
  errorMessage: any;
  countriesResponse: any;

  getCountries() {
    return this.http
      .get(this.countriesUrl)
      .map(response => response.json())
      .toPromise();
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.data || {};
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

  public closestCapital(location: any): any {
    var countrie: any;
    var capitalsCoords: any[];
    var minDistance = Infinity;
    var currentPosition = location;
    var closestCity: any[];

    for (countrie in this.countriesResponse.Results) {
      if (this.countriesResponse.Results[countrie].Capital != null)
        capitalsCoords.push(this.countriesResponse.Results[countrie].Capital);
    }

    for (var i = 1; i < (capitalsCoords.length - 1); i++) {
      var cityCoords = capitalsCoords[i];
      var distance = this.distance(currentPosition, cityCoords);
      if (distance < minDistance) {
        minDistance = distance;
        closestCity = cityCoords;
      }
    }
    return closestCity;
  }

  distance(pos1: any, pos2: any): number {
    var res: any;
    res = Math.pow((Math.pow((pos1.lat - pos2.GeoPt[0]), 2) + Math.pow((pos1.lng - pos2.GeoPt[1]), 2)), (1 / 2));
    return res;
  }
}