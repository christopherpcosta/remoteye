import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  networkValue = "remote";
  initialValue = "2000";

  constructor() {
    window.localStorage.setItem("networkValue", "remote");

    if(window.localStorage.getItem("initialVest")!= null)
    {
      this.initialValue = window.localStorage.getItem("initialVest");
    }
  }

  onChangeMerdas(event) {
    window.localStorage.setItem("networkValue", event.detail.value);
  }

  onChangeInitial(event) {
    window.localStorage.setItem("initialVest", event.detail.value);
  }

}
