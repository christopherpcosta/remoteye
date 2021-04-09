import { Component } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page {

  localIP = "192.168.1.61";
  externalIP = "109.51.26.39";

  constructor(public http: HttpClient) {
    this.main();
  }

  getRaw(endpoint: string, params?: any, reqOpts?: any, token?: string) {

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params.set(k, params[k]);
      }
    }

    return this.http.get(endpoint, { params: new HttpParams(), responseType: "json" });
  }

  async main() {

    setInterval(async () => {

      var networkToUse = window.localStorage.getItem("networkValue");
      var response;

      if (networkToUse == "remote" || networkToUse == null) {
        response = await fetch('http://109.51.26.39:5001/device1');
      }
      else {
        response = await fetch('http://192.168.1.61:5001/device1');
      }

      let data = await response.text();

      let array = JSON.parse(data);

      var result = "";

      for (var i = 0; i < array.length; i = i + 1) {
        result += "<p style=\"margin-bottom: 2px;margin-top: 2px;\">" + array[i] + "</p>";
      }

      document.getElementById("demo2").innerHTML = result;

    }, 2000);

  }


}
