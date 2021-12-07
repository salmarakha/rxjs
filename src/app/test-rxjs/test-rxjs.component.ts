import { Component, OnInit } from '@angular/core';
import { fromEvent, Observable, Subscriber, from, timer, interval, of } from 'rxjs';

@Component({
  selector: 'app-test-rxjs',
  templateUrl: './test-rxjs.component.html',
  styleUrls: ['./test-rxjs.component.css']
})
export class TestRxjsComponent implements OnInit {

  // create method is deprecated
  observable = new Observable((observer: Subscriber<any>) => {
    observer.next("Hello");
    observer.next("World");
  });

  // create an observable from a DOM event
  domEventObservable = fromEvent(document, 'click');

  // create an observable from a promise
  private promise = new Promise((res, rej) => {
    setTimeout(() => {
      res("Resolved!");
    }, 4000);
  });
  // fromPromise method is now wrapped inside the from method
  observablePromise = from(this.promise);

  // create an observable timer
  observableTimer = timer(5000);

  // create observable time interval (emits something every interval)
  observableInterval = interval(1000);

  // obsrvable of static values
  staticValueObservable = of("anything", ["you", "want"], 23, true, {cool: "stuff"});


  constructor() { }

  ngOnInit(): void {
    this.observable.subscribe(value => console.log(value));

    this.domEventObservable.subscribe(click => console.log(click));

    this.observablePromise.subscribe(value => console.log(value));

    this.observableTimer.subscribe(done => console.log("Done!"));

    this.observableInterval.subscribe(i => console.log(i));

    this.staticValueObservable.subscribe(value => console.log(value));

  }

}
