import { Page } from "../app.js";


/**
 * @param { Page } page - A instância da classe Page.
 */
export async function olaMundo(page) {

    await page.render('/pages/ola-mundo/ola-mundo.html', {
        items: ['item1', 'item2', 'item3'],
        counter: getCounter(page)
    });

    let stateButton = document.querySelector('#state')
    stateButton.addEventListener('click', async () => await incrConter(page))
}

const incrConter = async (page) => {
    await page.setState({counter: getCounter(page) + 1})
}

const getCounter = (page) => {
    let state = page.getState()
    return (state.counter) || 0
}
