import { Component, OnInit } from '@angular/core';
import { fromEvent, Observable, Subscriber, from, timer, interval, of, finalize, Subscription, connectable } from 'rxjs';

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

  /* Cold vs Hot observables */
  // Cold observable example
  cold = new Observable(observer => {
    observer.next(Math.random());
  });

  // Hot observable example
  private randomNum = Math.random();
  hot = new Observable(observer => {
    observer.next(this.randomNum);
  })


  constructor() { }

  ngOnInit(): void {
    this.observable.subscribe(value => console.log(value));

    this.domEventObservable.subscribe(click => console.log(click));

    this.observablePromise.subscribe(value => console.log(value));

    this.observableTimer
      // finalize executes when observable completes
      .pipe(finalize(() => console.log("Observable is complete.")))
      .subscribe(() => console.log("Timer finished!"));

    // store subscription in a variable to allow unsubscription
    const intervalSubscription: Subscription = this.observableInterval.subscribe(i => console.log(i));

    this.staticValueObservable.subscribe(value => console.log(value));

    setTimeout(() => {
      intervalSubscription.unsubscribe();
    }, 10000);

    /* these result in two different values because observable does not
      generate a random number until subscribed to it (producer inside the observable)*/
    console.log("Cold Observable");
    this.cold.subscribe(value => console.log(`Subscriber A: ${value}`));
    this.cold.subscribe(value => console.log(`Subscriber B: ${value}`));

    /* these output the same value because the producer is not contained inside the observable */
    console.log("Hot Observable");
    this.hot.subscribe(value => console.log(`Subscriber A: ${value}`));
    this.hot.subscribe(value => console.log(`Subscriber B: ${value}`));

    /* Convert a cold observable to hot observable by calling publish
      publish will allow subscribers to share the same values */
    console.log("Cold observable converted to Hot");
    const hotFromCold = connectable(this.cold); // publish operator is the same but it's depricated
    hotFromCold.subscribe(value => console.log(`Subscriber A: ${value}`));
    hotFromCold.subscribe(value => console.log(`Subscriber B: ${value}`));
    hotFromCold.connect(); // there won't be an output if connect() is not called

  }

}
