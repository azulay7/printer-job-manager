/**
 * mock for printer
 */
import * as Rx from "rxjs";

const subscription = new Rx.Subscription();

const printer= {
    print : (job) => {
        return new Promise((resolve) => {
            const id = setTimeout(resolve, 5000, job);
            subscription.add(() => clearTimeout(id));
        });
    },
    cancel:()=>{subscription.unsubscribe();}
}

export default printer;