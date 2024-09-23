export function sleep(n) {
    return new Promise(resolve => {
        setTimeout(() => resolve(true), n * 1000);
    })
}
