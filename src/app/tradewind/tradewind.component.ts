import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Pipe } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'tradewind',
  templateUrl: './tradewind.component.html',
  styleUrls: ['./tradewind.component.css']
})

export class TradewindComponent implements AfterViewInit {
  @ViewChild('myTable') myTable: ElementRef;
  initialState = [];
  initialStateCopy = [];
  timeSeries = [];
  limitExceeded = new Set();
  wrngExceeded = new Set();
  cfgdnoExceeded = new Set();
  poolLimits = new Map();

  dealCodeFrom = new Set();
  dealCodeTo = new Set();


  // the configured number is set to 40000000
  configuredNo = 40000000;

  initStateUrl = 'https://api.jsonbin.io/b/5b13004bc2e3344ccd96cb4a';
  timeSeriesUrl = 'https://api.jsonbin.io/b/5b130242c2e3344ccd96cb4d';

  constructor(private http: Http) { }

  ngOnInit() {
    this.getInitialState();
  }

  ngAfterViewInit() {
    this.http.get(this.initStateUrl)
      .subscribe(res => {
        this.initialState = res.json();

        for (let i = 0; i < this.initialState.length; i++) {

          let row = document.getElementById(this.initialState[i]['DealcodeFrom']);
          let show = parseInt(this.initialState[i]['Util1']) / parseInt(this.initialState[i]['Limit1']) * 100==NaN? "0" : parseInt(this.initialState[i]['Util1']) / parseInt(this.initialState[i]['Limit1']) * 100;
          let diff = parseInt(this.initialState[i]['Util1']) - parseInt(this.initialState[i]['Limit1']);
          let util = parseInt(this.initialState[i]['Util1']);
          let pct = parseInt(this.initialState[i]['Util1']) == 0? "0": Math.floor(parseFloat(show.toString())).toString();

          if (diff > 0) {
            let cell = (row as HTMLTableRowElement).insertCell(0);
            // cell.innerHTML = "<b><p>To " + this.initialState[i]['DealcodeTo'] + "</p></b>"
            //   + "<p>Credit Pool: " + this.initialState[i]['CreditPool'] + "</p>"
            //   //   // + "<p>Util: " + this.initialState[i]['Util1'] + "</p>"
            //   //     // + "<p>Limit: " + this.initialState[i]['Limit1'] + "</p>"
            //   + "<p>UtilPct: " + Math.floor(parseFloat(show.toString())).toString() + "</p>";


            cell.innerHTML = "<b>To " + this.initialState[i]['DealcodeTo'] + "</b><br>"
              + "Credit Pool: " + this.initialState[i]['CreditPool'] + "<br>"
              //   // + "<p>Util: " + this.initialState[i]['Util1'] + "</p>"
              //     // + "<p>Limit: " + this.initialState[i]['Limit1'] + "</p>"
               + "Util: " + this.initialState[i]['Util1'] + "<br>  Util Pct: " + pct +"%";

            cell.style.border = 'solid 1px';
            cell.style.minWidth = '1rem';
            cell.style.maxWidth = '1rem';
            cell.style.fontSize = '0.8em';
            cell.bgColor = '#FF512C';
            cell.className = 'CP' + this.initialState[i]['CreditPool'];// + 'F' + this.initialState[i]['DealcodeFrom'] + 'T' + this.initialState[i]['DealcodeTo'];

          }

          else if (show >= 75) {
            let cell = (row as HTMLTableRowElement).insertCell(-1);
            // cell.innerHTML = "<b><p>To " + this.initialState[i]['DealcodeTo'] + "</p></b>"
            //   + "<p>Credit Pool: " + this.initialState[i]['CreditPool'] + "</p>"
            //   //   // + "<p>Util: " + this.initialState[i]['Util1'] + "</p>"
            //   //     // + "<p>Limit: " + this.initialState[i]['Limit1'] + "</p>"
            //   + "<p>Util Pct: " + Math.floor(parseFloat(show.toString())).toString() + "</p>";

            
            cell.innerHTML = "<b>To " + this.initialState[i]['DealcodeTo'] + "</b><br>"
              + "Credit Pool: " + this.initialState[i]['CreditPool'] + "<br>"
              //   // + "<p>Util: " + this.initialState[i]['Util1'] + "</p>"
              //     // + "<p>Limit: " + this.initialState[i]['Limit1'] + "</p>"
               + "Util: " + this.initialState[i]['Util1'] + "<br> Util Pct: " + pct + "%";


            cell.style.border = 'solid 1px';
            cell.style.minWidth = '1rem';
            cell.style.maxWidth = '1rem';
            cell.style.fontSize = '0.8em';
            cell.bgColor = '#FFCC00';
            cell.className = 'CP' + this.initialState[i]['CreditPool'];// + 'F' + this.initialState[i]['DealcodeFrom'] + 'T' + this.initialState[i]['DealcodeTo'];
          }

          

          else if (show < 75 && util > this.configuredNo) {
            let cell = (row as HTMLTableRowElement).insertCell(-1);
            cell.innerHTML = "<b>To " + this.initialState[i]['DealcodeTo'] + "</b><br>"
              + "Credit Pool: " + this.initialState[i]['CreditPool'] + "<br>"
               + "Util: " + this.initialState[i]['Util1'] + " <br> Util Pct: " + pct +"%";
            cell.style.border = 'solid 1px';
            cell.style.minWidth = '1rem';
            cell.style.maxWidth = '1rem';
            cell.style.fontSize = '0.8em';
            cell.bgColor = '#94D878';
            cell.className = 'CP' + this.initialState[i]['CreditPool'];// + 'F' + this.initialState[i]['DealcodeFrom'] + 'T' + this.initialState[i]['DealcodeTo'];

          }

          else{
            let cell = (row as HTMLTableRowElement).insertCell(-1);
            cell.innerHTML = "<b>To " + this.initialState[i]['DealcodeTo'] + "</b><br>"
              + "Credit Pool: " + this.initialState[i]['CreditPool'] + "<br>"
               + "Util: " + this.initialState[i]['Util1'] + "<br>  Util Pct: " + pct +"%";
            cell.style.border = 'solid 1px';
            cell.style.minWidth = '1rem';
            cell.style.maxWidth = '1rem';
            cell.style.fontSize = '0.8em';
            cell.bgColor = '#DCDCDC';
            cell.className = 'CP' + this.initialState[i]['CreditPool'];// + 'F' + this.initialState[i]['DealcodeFrom'] + 'T' + this.initialState[i]['DealcodeTo'];
          }

        }
      })


      this.getTimeSeries();
    //

    // if (show.toString() == 'NaN')
    //   show = 0;

    //Working nxn grid
    // let id = document.getElementById(this.initialState[i]['DealcodeFrom'] + 'x' + i);//this.initialState[i]['DealcodeTo']);
    // if (id !== null) {
    //   id.innerHTML = "<p>From " + this.initialState[i]['DealcodeFrom'] + "</p>"
    //   + "<p>Credit Pool: " + this.initialState[i]['CreditPool'] + "</p>"
    //   // + "<p>Util: " + this.initialState[i]['Util1'] + "</p>"
    //     // + "<p>Limit: " + this.initialState[i]['Limit1'] + "</p>"
    //     + "<p>UtilPct: " + Math.floor(parseFloat(show.toString())).toString() + "</p>";
    // }

    
  }


  setValue() {
    this.ngAfterViewInit();
  }

  getTimeSeries() {
    this.http.get(this.timeSeriesUrl)
      .subscribe(res => {
        this.setTimeSeries(res.json());
      })
  }

  setTimeSeries(res) {
    // save timeseries api response
    // this.timeSeries = res;
    this.http.get(this.timeSeriesUrl)
      .subscribe(res => {        
        this.timeSeries = res.json();
        for (let i = 0; i < this.timeSeries.length; i++) {

          let pLimit = parseInt(this.poolLimits.get(this.timeSeries[i]['CreditPool'])) ==NaN||null||undefined?0:parseInt(this.poolLimits.get(this.timeSeries[i]['CreditPool']));
          //  alert("Util1:"+parseInt(this.timeSeries[i]['Util1']));
          //  alert(this.timeSeries[i]['CreditPool']+":"+pLimit);
          
          if (parseInt(this.timeSeries[i]['Util1']) > pLimit) {
            // this.setDelay(i, this.timeSeries[i]['CreditPool'], 'limit');
            
            let cell = document.getElementsByClassName('CP' + this.timeSeries[i]['CreditPool']);
            let show = parseInt(this.initialState[i]['Util1']) / parseInt(this.initialState[i]['Limit1']) * 100==NaN? "0" : parseInt(this.initialState[i]['Util1']) / parseInt(this.initialState[i]['Limit1']) * 100;
            let pct = parseInt(this.initialState[i]['Util1']) == 0? "0": Math.floor(parseFloat(show.toString())).toString();

            if (cell.length > 0) {
              setTimeout(function () {
                for (let j = 0; j < cell.length; j++) {

                  (cell[j] as HTMLTableCellElement).innerHTML = "<b>To " + this.initialState[i]['DealcodeTo'] + "</b><br>"
                  + "Credit Pool: " + this.initialState[i]['CreditPool'] + "<br>"
                  //   // + "<p>Util: " + this.initialState[i]['Util1'] + "</p>"
                  //     // + "<p>Limit: " + this.initialState[i]['Limit1'] + "</p>"
                   + "Util: " + this.initialState[i]['Util1'] + "<br> Util Pct: " + pct + "%";
    
    
                   (cell[j] as HTMLTableCellElement).style.border = 'solid 1px';
                   (cell[j] as HTMLTableCellElement).style.minWidth = '1rem';
                   (cell[j] as HTMLTableCellElement).style.maxWidth = '1rem';
                   (cell[j] as HTMLTableCellElement).style.fontSize = '0.8em';
                   (cell[j] as HTMLTableCellElement).bgColor = '#FF512C';
                   (cell[j] as HTMLTableCellElement).className = 'CP' + this.initialState[i]['CreditPool'];// + 'F' + this.initialState[i]['DealcodeFrom'] + 'T' + this.initialState[i]['DealcodeTo'];              

                }
              }, 1000 * i);
            }
          }
    
          else if (parseInt(this.timeSeries[i]['Util1']) / parseInt(this.poolLimits.get(this.timeSeries[i]['CreditPool'])) * 100 > 75) {
            // this.setDelay(i, this.timeSeries[i]['CreditPool'], 'wrng');
            let cell = document.getElementsByClassName('CP' + this.timeSeries[i]['CreditPool']);
            let show = parseInt(this.initialState[i]['Util1']) / parseInt(this.initialState[i]['Limit1']) * 100==NaN? "0" : parseInt(this.initialState[i]['Util1']) / parseInt(this.initialState[i]['Limit1']) * 100;
            let pct = parseInt(this.initialState[i]['Util1']) == 0? "0": Math.floor(parseFloat(show.toString())).toString();

            if (cell.length > 0) {
              setTimeout(function () {
                for (let j = 0; j < cell.length; j++) {
                  
                  (cell[j] as HTMLTableCellElement).bgColor = '#FFCC00';

                  // (cell[j] as HTMLTableCellElement).innerHTML = "<b>To " + this.initialState[i]['DealcodeTo'] + "</b><br>"
                  // + "Credit Pool: " + this.initialState[i]['CreditPool'] + "<br>"
                  // //   // + "<p>Util: " + this.initialState[i]['Util1'] + "</p>"
                  // //     // + "<p>Limit: " + this.initialState[i]['Limit1'] + "</p>"
                  //  + "Util: " + this.initialState[i]['Util1'] + "<br> Util Pct: " + pct + "%";    
    
                  //  (cell[j] as HTMLTableCellElement).style.border = 'solid 1px';
                  //  (cell[j] as HTMLTableCellElement).style.minWidth = '1rem';
                  //  (cell[j] as HTMLTableCellElement).style.maxWidth = '1rem';
                  //  (cell[j] as HTMLTableCellElement).style.fontSize = '0.8em'; 
                  //  (cell[j] as HTMLTableCellElement).className = 'CP' + this.initialState[i]['CreditPool'];

                }
              }, 1000 * i);
            }
          }
    
          
    
          else if ( parseInt(this.timeSeries[i]['Util1']) > this.configuredNo) {
            // this.setDelay(i, this.timeSeries[i]['CreditPool'], 'cgfno');
            let cell = document.getElementsByClassName('CP' + this.timeSeries[i]['CreditPool']);
            let show = parseInt(this.initialState[i]['Util1']) / parseInt(this.initialState[i]['Limit1']) * 100 == NaN ? "0" : parseInt(this.initialState[i]['Util1']) / parseInt(this.initialState[i]['Limit1']) * 100;
            let pct = parseInt(this.initialState[i]['Util1']) == 0 ? "0" : Math.floor(parseFloat(show.toString())).toString();

            if (cell.length > 0) {
              setTimeout(function () {
                for (let j = 0; j < cell.length; j++) {

                  // (cell[j] as HTMLTableCellElement).innerHTML = "<b>To " + this.initialState[i]['DealcodeTo'] + "</b><br>"
                  //   + "Credit Pool: " + this.initialState[i]['CreditPool'] + "<br>"
                  //   + "Util: " + this.initialState[i]['Util1'] + " <br> Util Pct: " + pct + "%";

                  // (cell[j] as HTMLTableCellElement).style.border = 'solid 1px';
                  // (cell[j] as HTMLTableCellElement).style.minWidth = '1rem';
                  // (cell[j] as HTMLTableCellElement).style.maxWidth = '1rem';
                  // (cell[j] as HTMLTableCellElement).style.fontSize = '0.8em';
                  (cell[j] as HTMLTableCellElement).className = '#94D878';
                  // (cell[j] as HTMLTableCellElement).className = 'CP' + this.initialState[i]['CreditPool'];// + 'F' + this.initialState[i]['DealcodeFrom'] + 'T' + this.initialState[i]['DealcodeTo'];

                }
              }, 1000 * i);
            }
          }


          else{
            let cell = document.getElementsByClassName('CP' + this.timeSeries[i]['CreditPool']);
            let show = parseInt(this.initialState[i]['Util1']) / parseInt(this.initialState[i]['Limit1']) * 100 == NaN ? "0" : parseInt(this.initialState[i]['Util1']) / parseInt(this.initialState[i]['Limit1']) * 100;
            let pct = parseInt(this.initialState[i]['Util1']) == 0 ? "0" : Math.floor(parseFloat(show.toString())).toString();

            if (cell.length > 0) {
              setTimeout(function () {
                for (let j = 0; j < cell.length; j++) {

                  // (cell[j] as HTMLTableCellElement).innerHTML = "<b>To " + this.initialState[i]['DealcodeTo'] + "</b><br>"
                  //   + "Credit Pool: " + this.initialState[i]['CreditPool'] + "<br>"
                  //   + "Util: " + this.initialState[i]['Util1'] + " <br> Util Pct: " + pct + "%";

                  // (cell[j] as HTMLTableCellElement).style.border = 'solid 1px';
                  // (cell[j] as HTMLTableCellElement).style.minWidth = '1rem';
                  // (cell[j] as HTMLTableCellElement).style.maxWidth = '1rem';
                  // (cell[j] as HTMLTableCellElement).style.fontSize = '0.8em';
                  (cell[j] as HTMLTableCellElement).bgColor = '#DCDCDC';
                  // (cell[j] as HTMLTableCellElement).className = 'CP' + this.initialState[i]['CreditPool'];// + 'F' + this.initialState[i]['DealcodeFrom'] + 'T' + this.initialState[i]['DealcodeTo'];

                }
              }, 1000 * i);
            }


          }
        }


      })

    
/*
      if (parseInt(this.timeSeries[i]['Util1']) > this.configuredNo) {
        this.setDelay(i, 'cfg', this.timeSeries[i]['CreditPool']);
      }

      if (parseInt(this.timeSeries[i]['Util1']) > parseInt(this.poolLimits.get(this.timeSeries[i]['CreditPool']))) {
        this.setDelay(i, 'lmt', this.timeSeries[i]['CreditPool']);
      }
*/
    

    // for (let i = 0; i < this.timeSeries.length; i++) {
    //   if (parseInt(this.timeSeries[i]['Util1']) / parseInt(this.poolLimits.get(this.timeSeries[i]['CreditPool'])) * 100 > 75) {
    //     this.setDelay(i, 'wrn', this.timeSeries[i]['CreditPool']);
    //   }

    //   if (parseInt(this.timeSeries[i]['Util1']) > this.configuredNo) {
    //     this.setDelay(i, 'cfg', this.timeSeries[i]['CreditPool']);
    //   }

    //   if (parseInt(this.timeSeries[i]['Util1']) > parseInt(this.poolLimits.get(this.timeSeries[i]['CreditPool']))) {
    //     this.setDelay(i, 'lmt', this.timeSeries[i]['CreditPool']);
    //   }
    // }
  }

  setDelay(i, pool, mode) {
    let cell = document.getElementsByClassName('CP' + pool);

    // mimicking websocket by introducing one second delay
    

    if (cell.length > 0) {
      setTimeout(function () {
        for (let j = 0; j < cell.length; j++) {
          (cell[j] as HTMLTableCellElement).bgColor = '#FF512C';
        }
      }, 1000 * i);
        // if (mode == "limit") {
        //   for (let j = 0; j < cell.length; j++) {
        //     (cell[j] as HTMLTableCellElement).bgColor = '#FF512C';
        //   }
        // }
        // if (mode == "wrng") {
        //   for (let j = 0; j < cell.length; j++) {
        //     (cell[j] as HTMLTableCellElement).bgColor = '#FFCC00';
        //   }
        // }
     
    }
      // switch (mode) {
      //   case 'cgfno':
      //     setTimeout(function () {
      //       for (let j = 0; j < cell.length; j++) {
      //         (cell[j] as HTMLTableCellElement).bgColor = '#94D878';
      //       }
      //     }, 1000 * i);
      //   case 'limit':
      //     setTimeout(function () {
      //       for (let j = 0; j < cell.length; j++) {
      //         (cell[j] as HTMLTableCellElement).bgColor = '#FF512C';
      //       }
      //     }, 1000 * i);
      //   case 'wrng':
      //     setTimeout(function () {
      //       for (let j = 0; j < cell.length; j++) {
      //         (cell[j] as HTMLTableCellElement).bgColor = '#FFCC00';
      //       }
      //     }, 1000 * i);
      // }
    

  }


  // setDelay(i, group, pool) {
  //   // mimicking websocket by introducing one second delay
  //   setTimeout(() => {
  //     switch (group) {
  //       // based on new transactions, add credit pools to their respective hash sets
  //       case 'wrn':
  //         this.wrngExceeded.add(pool);
  //       case 'cfg':
  //         this.cfgdnoExceeded.add(pool);
  //       case 'lmt':
  //         this.limitExceeded.add(pool);
  //     }
  //   }, 1000 * i);
  // }

  getInitialState() {
    this.http.get(this.initStateUrl)
      .subscribe(res => {
        this.setInitialState(res.json());
      })
  }


  setInitialState(res) {
    // save initial state api response
    this.initialState = res;

    this.initialStateCopy = JSON.parse(JSON.stringify(this.initialState));

    for (let i = 0; i < this.initialState.length; i++) {

      this.dealCodeFrom.add(this.initialState[i]['DealcodeFrom']);
      this.dealCodeTo.add(this.initialState[i]['DealcodeTo']);

      this.dealCodeFrom = new Set(Array.from(this.dealCodeFrom).sort());
      this.dealCodeTo = new Set(Array.from(this.dealCodeTo).sort());
     /* 
      let show = parseInt(this.initialState[i]['Util1']) / parseInt(this.initialState[i]['Limit1']) * 100;

      // document.getElementById(this.initialState[i]['DealcodeFrom']+'x'+this.initialState[i]['DealcodeTo']).innerHTML = show.toString();;


      if (parseInt(this.initialState[i]['Util1']) > parseInt(this.initialState[i]['Limit1'])) {
        // creating a hash set of all the credit pools whose utilization exceeded the limit
        this.limitExceeded.add(this.initialState[i]['CreditPool']);
      }
      else {
        if (this.limitExceeded.has(this.initialState[i]['CreditPool']))
          // remove the last entry and only keep the latest transaction of the credit pool
          this.limitExceeded.delete(this.initialState[i]['CreditPool']);
      }

      let utilpct = parseInt(this.initialState[i]['Util1']) / parseInt(this.initialState[i]['Limit1']) * 100;

      if (utilpct >= parseInt(this.initialState[i]['WarnPct'])) {
        // creating a hash set of all the credit pools whose utilization exceeded the warning percentage
        this.wrngExceeded.add(this.initialState[i]['CreditPool']);
      }
      else {
        if (this.wrngExceeded.has(this.initialState[i]['CreditPool']))
          // remove the last entry and only keep the latest transaction of the credit pool
          this.wrngExceeded.delete(this.initialState[i]['CreditPool']);
      }

      if (parseInt(this.initialState[i]['Util1']) > this.configuredNo) {
        // creating a hash set of all the credit pools whose utilization exceeded the configured number
        this.cfgdnoExceeded.add(this.initialState[i]['CreditPool']);
      }
      else {
        if (this.cfgdnoExceeded.has(this.initialState[i]['CreditPool']))
          // remove the last entry and only keep the latest transaction of the credit pool
          this.cfgdnoExceeded.delete(this.initialState[i]['CreditPool']);
      }
*/
      if (!this.poolLimits.has(this.initialState[i]['CreditPool'])) {
        // creating a hash map of all the credit pools and their limits
        this.poolLimits.set(this.initialState[i]['CreditPool'], this.initialState[i]['Limit1']);
      }
    }

    console.log("this.poolLimits");
    console.log(this.poolLimits); 
    // console.log("this.dealCodeTo");
    // console.log(this.dealCodeTo);

  }
}