import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  IPAddress = "remote";
  Dashboard = [];

  Ethermine = {
    UnpaidBalancer: "",
    currentHashrate: "",
    reportedHashrate: "",
    averageHashrate: "",
    validShares: 0,
    invalidShares: 0,
    alreadyPaid: 0.000000,
    totalPaid: 0.00,
    totalPaidEuro: "",
    totalPaidEth: "",
    remainingEuro: "",
    coinperdayJOAO: ""
  }


  constructor() {

    setInterval(async () => {
      this.Dashboard = [];
      this.main();
    }, 5000);

    this.getEthermine();
    this.fetchHistory();
    setInterval(async () => {
      this.getEthermine();
      this.fetchHistory();
    }, 15000);

  }

  async main() {
    var value = window.localStorage.getItem("networkValue");
    if (value != null)
      this.IPAddress = value;

    if (this.IPAddress == "remote") {
      fetch(
        "http://109.51.26.39:8085/data.json",
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'GET'
        }
      ).then(async result => {
        let data2 = await result.text();
        try {
          let array = JSON.parse(data2);
          this.findTemp(array.Children);
        }
        catch (err) {

        }
      }).then(() => {
        fetch(
          "http://109.51.26.39:8086/data.json",
          {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'GET'
          }
        ).then(async result => {
          let data2 = await result.text();
          try {
            let array = JSON.parse(data2);
            this.findTemp(array.Children);
            this.Dashboard.sort();
          }
          catch (err) {

          }
        });
      });
    }

    if (this.IPAddress == "local") {

      let response2 = fetch(
        "http://192.168.1.61:8086/data.json",
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'GET'
        }
      ).then(async result => {
        let data2 = await result.text();
        try {
          let array = JSON.parse(data2);
          this.findTemp(array.Children);
        }
        catch (err) {

        }
      }).then(() => {
        fetch(
          "http://192.168.1.69:8085/data.json",
          {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'GET'
          }
        ).then(async result => {
          let data2 = await result.text();
          try {
            let array = JSON.parse(data2);
            this.findTemp(array.Children);
            this.Dashboard.sort();
          }
          catch (err) {

          }
        });
      });

    }
  }

  getEthermine() {

    fetch(
      "https://api.ethermine.org/miner/1984c7Ebfb88D7AE5Be43c49172dD807E2182AA7/dashboard",
      {
        method: 'GET'
      }
    ).then(async result => {
      let data2 = await result.text();
      try {
        let array = JSON.parse(data2);

        this.Ethermine.UnpaidBalancer = (array.data.currentStatistics.unpaid / 1000000000000000000).toFixed(5);
        this.Ethermine.currentHashrate = (array.data.currentStatistics.currentHashrate / 1000000).toFixed(2);
        this.Ethermine.reportedHashrate = (array.data.currentStatistics.reportedHashrate / 1000000).toFixed(2);
        this.Ethermine.validShares = array.data.currentStatistics.validShares;
        this.Ethermine.invalidShares = array.data.currentStatistics.invalidShares;


        this.fetchPayout();

      }
      catch (err) {

      }
    });
  }

  fetchPayout() {
    fetch(
      "https://api.ethermine.org/miner/1984c7Ebfb88D7AE5Be43c49172dD807E2182AA7/payouts",
      {
        method: 'GET'
      }
    ).then(async result => {
      let data2 = await result.text();
      try {
        let array = JSON.parse(data2);
        this.Ethermine.alreadyPaid = 0;
        array.data.forEach(payout => {
          this.Ethermine.alreadyPaid += Number((payout.amount / 1000000000000000000).toFixed(5));
        });

        this.Ethermine.totalPaid = (Number(this.Ethermine.UnpaidBalancer) + Number(this.Ethermine.alreadyPaid));

        this.getConversion();
      }
      catch (err) {

      }
    });
  }

  getConversion() {
    fetch(
      "https://cex.io/api/last_price/ETH/EUR",
      {
        method: 'GET'
      },
    ).then(async result => {
      let data2 = await result.text();
      try {
        let array = JSON.parse(data2);

        this.Ethermine.totalPaidEth = (this.Ethermine.totalPaid).toFixed(4);
        this.Ethermine.totalPaidEuro = (this.Ethermine.totalPaid * array.lprice).toFixed(2);
        this.Ethermine.remainingEuro = (Number(window.localStorage.getItem("initialVest")) - Number(this.Ethermine.totalPaidEuro)).toFixed(2);

        this.fetchCurrentStats();
      }
      catch (err) {

      }
    });
  }

  fetchCurrentStats() {
    fetch(
      "https://api.ethermine.org/miner/1984c7Ebfb88D7AE5Be43c49172dD807E2182AA7/currentStats",
      {
        method: 'GET'
      }
    ).then(async result => {
      let data2 = await result.text();
      try {
        let array = JSON.parse(data2);
        this.Ethermine.coinperdayJOAO = ((array.data.coinsPerMin) * 24 * 60).toFixed(5);
      }
      catch (err) {

      }
    });
  }

  fetchHistory() {
    fetch(
      "https://api.ethermine.org/miner/1984c7Ebfb88D7AE5Be43c49172dD807E2182AA7/history",
      {
        method: 'GET'
      }
    ).then(async result => {
      let data2 = await result.text();
      try {
        let array = JSON.parse(data2);
        this.Ethermine.averageHashrate = (array.data[0].averageHashrate / 1000000).toFixed(2);
      }
      catch (err) {

      }
    });
  }


  findTemp(jsonResponse) {
    jsonResponse.forEach(element => {

      if (element.Text.indexOf('NVIDIA') > -1) {
        this.Dashboard.push({ Name: element.Text, Temperature: element.Children[1].Children[0].Value + " || " + element.Children[1].Children[0].Max });
      }
      else if (element.Text.indexOf('Intel') > -1) {
        this.Dashboard.push({ Name: element.Text, Temperature: element.Children[1].Children[0].Value + " || " + element.Children[1].Children[0].Max });
      }
      else if (element.Text.indexOf('Radeon') > -1) {
        this.Dashboard.push({ Name: element.Text, Temperature: element.Children[2].Children[0].Value + " || " + element.Children[2].Children[0].Max });
      }
      else {
        this.findTemp(element.Children);
      }
    });
  }



}
