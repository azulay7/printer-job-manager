/**
 * mock for printer
 */
const printer= {
    print : (job) => {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, 5000, job);
        });
    }
}

export default printer;