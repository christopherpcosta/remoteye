import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  networkValue = "remote";

  constructor() {
    window.localStorage.setItem("networkValue", "remote");
  }

  onChangeMerdas(event) {
    window.localStorage.setItem("networkValue", event.detail.value);
  }


}
