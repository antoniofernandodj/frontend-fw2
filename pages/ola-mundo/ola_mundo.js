import { Page } from "../../app.js";


/**
 * @param { Page } page - A instância da classe Page.
 */
export async function olaMundo(page) {
    
    await page.render('/pages/ola-mundo/ola-mundo.html', {
        items: ['item1', 'item2', 'item3'],
        counter: getCounter(page)
    });

    page.addEventListener({
        selector: '#notificar-sucesso', type: 'click',
        handler: () => {
            page.notify('Mensagem de sucesso exibida com sucesso!', {
                type: 'success', duration: 3000
            });
        }
    });

    page.addEventListener({
        selector: '#notificar-erro', type: 'click',
        handler: () => {
            page.notify('Mensagem de erro! :(', {
                type: 'error', duration: 5000
            });
        }
    });

    let stateButton = document.querySelector('#state')
    stateButton.addEventListener('click', async () => await incrConter(page))
}

/**
 * @param { Page } page
 */
const incrConter = async (page) => {
    await page.setState({counter: getCounter(page) + 1})
}

/**
 * @param { Page } page
 */
const getCounter = (page) => {
    let state = page.getState()
    return (state.counter) || 0
}
