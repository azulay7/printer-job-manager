/**
 * mock for printer
 */
import * as Rx from 'rxjs';

// const subscription = new Subscription();

const printer= {
    print : (job) => {
        return new Rx.Observable(observer => {
            setInterval(() => {
                observer.next(job);
            }, 5000)
        })
    },
    cancel:(subscription)=>{subscription.unsubscribe()}
}

export default printer;