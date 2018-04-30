/**
 * mock for printer
 */
import * as Rx from 'rxjs';

// const subscription = new Subscription();

const printer= {
    print : (job) => {
        return new Rx.Observable(observer => {
            setTimeout(() => {
                observer.next(job);
            }, Math.floor(Math.random() * 10000) +5000 )
        })
    },
    cancel:(subscription)=>{subscription.unsubscribe()}
}

export default printer;