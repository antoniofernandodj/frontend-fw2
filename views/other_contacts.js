import { sleep } from "../utils.js";
import { Page } from "../app.js";

/**
 * @param { Page } page - A instância da classe Page.
 */
export async function otherContacts(page) {

    page.setContext({ title: 'Lista de Contatos' });

    let contactsLists = [
        [
            { name: 'João', email: 'joao@example.com' },
            { name: 'Maria', email: 'maria@example.com' }
        ],

        [
            { name: 'Pedro', email: 'pedro@example.com' },
            { name: 'Ricardo', email: 'ricardo@example.com' }
        ],

        [
            { name: 'Benedita', email: 'benedita@example.com' },
            { name: 'Gabriel', email: 'gabriel@example.com' }
        ]
        
    ]

    for (let contactList of contactsLists) {
        
        page.render('/pages/other-contacts/other-contacts.html', {
            contacts: contactList
        });

        await sleep(1);
    }

}
