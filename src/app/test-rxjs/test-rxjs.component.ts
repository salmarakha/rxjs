import { Component, OnInit } from '@angular/core';
import { fromEvent, Observable, Subscriber, from, timer, interval, of, finalize, Subscription, connectable, map, tap, filter } from 'rxjs';

@Component({
  selector: 'app-test-rxjs',
  templateUrl: './test-rxjs.component.html',
  styleUrls: ['./test-rxjs.component.css']
})
export class TestRxjsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // create method is deprecated
    const observable = new Observable((observer: Subscriber<any>) => {
      observer.next("Hello");
      observer.next("World");
    });
    observable.subscribe(value => console.log(value));


    // create an observable from a DOM event
    const domEventObservable = fromEvent(document, 'click');
    domEventObservable.subscribe(click => console.log(click));


    // create an observable from a promise
    const promise = new Promise((res, rej) => {
    setTimeout(() => {
      res("Resolved!");
    }, 4000);
    });
    // fromPromise method is now wrapped inside the from method
    const observablePromise = from(promise);
    observablePromise.subscribe(value => console.log(value));


    // create an observable timer
    const observableTimer = timer(5000);
    observableTimer
      // finalize executes when observable completes
      .pipe(finalize(() => console.log("Observable is complete.")))
      .subscribe(() => console.log("Timer finished!"));


    // create observable time interval (emits something every interval)
    const observableInterval = interval(1000);
    // store subscription in a variable to allow unsubscription
    const intervalSubscription: Subscription = observableInterval.subscribe(i => console.log(i));


    // obsrvable of static values
    const staticValueObservable = of("anything", ["you", "want"], 23, true, {cool: "stuff"});
    staticValueObservable.subscribe(value => console.log(value));

    // unsubscrib to an observable
    setTimeout(() => {
      intervalSubscription.unsubscribe();
    }, 10000);

    /* Cold vs Hot observables */
    // Cold observable example
    const cold = new Observable(observer => {
      observer.next(Math.random());
    });
    /* these result in two different values because observable does not
      generate a random number until subscribed to it (producer inside the observable)*/
    console.log("Cold Observable");
    cold.subscribe(value => console.log(`Subscriber A: ${value}`));
    cold.subscribe(value => console.log(`Subscriber B: ${value}`));


    // Hot observable example
    let randomNum = Math.random();
    const hot = new Observable(observer => {
      observer.next(randomNum);
    })
    /* these output the same value because the producer is not contained inside the observable */
    console.log("Hot Observable");
    hot.subscribe(value => console.log(`Subscriber A: ${value}`));
    hot.subscribe(value => console.log(`Subscriber B: ${value}`));

    /* Convert a cold observable to hot observable by calling connectable
      connectable will allow subscribers to share the same values */
    console.log("Cold observable converted to Hot");
    const hotFromCold = connectable(cold); // publish operator is the same but it's depricated
    hotFromCold.subscribe(value => console.log(`Subscriber A: ${value}`));
    hotFromCold.subscribe(value => console.log(`Subscriber B: ${value}`));
    hotFromCold.connect(); // there won't be an output if connect() is not called


    // Operators
    // Map (A common use is to convert JSON response from an API call to a javascript object)
    const numbers = from([10, 100, 1000]);
    numbers
      .pipe(map(num => Math.log(num)))
      .subscribe(value => console.log(value));

    // Tap / do
    // allows running code at any point in the observable
    numbers
      .pipe(
        tap(value => console.log("Values before map", value)),
        map(num => Math.log(num))
      )
      .subscribe(value => console.log(value));

      // Filter
      const tweets = [
        {
          body: "Dummy text 1",
          user: "@angularfirebase"
        },
        {
          body: "Dummy text 2",
          user: "@angularfirebase"
        },
        {
          body: "Dummy text 3",
          user: "@google"
        },
        {
          body: "Dummy text 4",
          user: "@whatever"
        },
        {
          body: "Dummy text 5",
          user: "@twitter"
        },
      ];
      const tweetsObservableUsingFrom = from(tweets);
      tweetsObservableUsingFrom
        .pipe(filter(tweet => tweet.user === "@angularfirebase"))
        .subscribe(value => console.log(value)); // this will return each object individually

      const tweetsObservableUsingOf = of(tweets);
      tweetsObservableUsingOf
        .pipe(map(tweets => tweets.filter(tweet => tweet.user === "@angularfirebase")))
        .subscribe(value => console.log(value)); // returns an array of filtered objects
  }

}
