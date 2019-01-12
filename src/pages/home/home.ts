import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { RestProvider } from '../../providers/rest/rest';
import { Storage } from '@ionic/storage';
import { visitProjectedRenderNodes } from '@angular/core/src/view/util';

declare var google;

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})

export class HomePage {

  lat: any;
  lng: any;
  destLat: any;
  destLng: any;
  url: string;
  location: any;
  obj: any;
  pointNumber: number;
  visited: number;

  constructor(public navCtrl: NavController, public geo: Geolocation, private inAppBrowser: InAppBrowser,
    public restProvider: RestProvider, private storage: Storage) {
    this.visited = 0;
    storage.get('visited').then((val) => {
      this.visited = val;
    });
  }

  openWebpage(url: string) {

    this.checkLat();
    const options: InAppBrowserOptions = {
      zoom: 'no',
      presentationstyle: 'formsheet',
    }
    url = "https://www.google.com/maps/dir/'" + this.lat + "," + this.lng + "'/'" + this.obj[1] + "," + this.obj[2] + "'/";
    const browser = this.inAppBrowser.create(url, '_system', options);

  }

  ionViewDidLoad() {
    this.geo.getCurrentPosition().then(pos => {
      this.lat = pos.coords.latitude;
      this.lng = pos.coords.longitude;
    }).catch(err => console.log(err));
  }

  checkLat() {
    this.geo.getCurrentPosition().then(pos => {
      this.lat = pos.coords.latitude;
      this.lng = pos.coords.longitude;
    }).catch(err => console.log(err));
  }

  getLocation() {
    this.pointNumber = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
    var inPlaceBtn = document.getElementById("done");

    inPlaceBtn.removeAttribute("disabled");

    this.restProvider.getLocation(this.pointNumber)
      .then(data => {
        this.location = data;
        const values = Object.keys(data).map(key => data[key]);
        this.obj = Object["values"](values);
        document.getElementById("lat").innerText = "Lat: " + this.obj[1];
        document.getElementById("lng").innerText = "Lng: " + this.obj[2];
      }).then(resolve => this.LoadMap());
  }

  LoadMap() {
    var d = document.getElementById("fm");
    var link = 'https://www.google.com/maps/embed?pb=!1m24!1m12!1m3!1d21210.139600833525!2d19.00806046407566!3d49.789994568078804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m9!3e2!4m3!3m2!1d' + this.lat + '!2d' + this.lng + '8!4m3!3m2!1d' + this.obj[1] + '1!2d' + this.obj[2] + '3!5e0!3m2!1spl!2spl!4v1547224211572';
    d.setAttribute('src', link);
  }

  getDistance() {
    if (this.obj != null) {
      var lat1 = this.lat;
      var lon1 = this.lng;
      var lat2 = this.obj[1];
      var lon2 = this.obj[2];
      var inPlaceBtn = document.getElementById("done");

      var p = 0.017453292519943295;    // Math.PI / 180
      var c = Math.cos;
      var a = 0.5 - c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p)) / 2;

      var result = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
      console.log(result);

      if (result < 0.1) {
        alert("CONGRATULATIONS, YOU REACHED DESTINATION POINT!");
        this.visited += 1;
        this.storage.set('visited', this.visited);
        this.storage.set(this.obj[0], 'lat: ' + this.obj[1] + ',' + 'lng: ' + this.obj[2]);
        inPlaceBtn.setAttribute("disabled", "on");
      }
      else
        alert("YOU ARE TOO FAR FROM DESTINATION POINT. TRY AGAIN.")
    }
  }

  turnCheatOn() {
    if (this.obj != null) {
      var x = document.getElementById("cheat");

      if (x.textContent == "CHEAT ON") {
        this.lat = this.obj[1];
        this.lng = this.obj[2];
        x.textContent = "CHEAT OFF";
      }
      else {
        x.textContent = "CHEAT ON";
        this.checkLat();
      }
    }
  }
}