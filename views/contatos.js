import { sleep } from "../utils.js";
import { Page } from "../app.js";

/**
 * @param { Page } page - A instância da classe Page.
 */
export async function contatos(page) {
    page.setTitle('Meus contatos')

    await page.render('/pages/my-contacts/my-contacts.html');

    let email = document.querySelector('#email');
    let end = document.querySelector('#end');
    let wp = document.querySelector('#wp');
    let tel = document.querySelector('#tel');

    let otherContact = {
        email: 'outro@email.com',
        end: 'Rua Outra, numero 1',
        wp: '+55 21 88888-8888',
        tel: '21 1111-1111'
    } 

    page.addEventListener({
        selector: '#update-contacts',
        type: 'click',
        handler: async () => {
            alert('Atualizando contatos...');

            await sleep(1);

            email.innerHTML = otherContact.email;
            end.innerHTML = otherContact.end;
            wp.innerHTML = otherContact.wp;
            tel.innerHTML = otherContact.tel;
        }
    });
}