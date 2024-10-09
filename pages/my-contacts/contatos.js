import { sleep } from "../../utils.js";
import { Page } from "../../app.js";


export class Contatos {

    /**
     * @param { Page } page - A instância da classe Page.
     */
    constructor(page) {
        this.page = page;
        this.otherContact = {
            email: 'outro@email.com',
            end: 'Rua Outra, numero 1',
            wp: '+55 21 88888-8888',
            tel: '21 1111-1111'
        };
    }

    async beforeInit() {
        this.page.setTitle('Meus contatos');
    }

    async init() {
        const userId = this.page.getParam('contact'); // userId será '123'
        await this.page.render('/pages/my-contacts/my-contacts.html');
    }

    setupEventListeners() {
        this.page.addEventListener({
            selector: '#update-contacts',
            type: 'click',
            handler: async () => this.updateContacts()
        });
    }

    async updateContacts(page) {
        alert('Atualizando contatos...');
        await sleep(1);


        const email = document.querySelector('#email');
        const end = document.querySelector('#end');
        const wp = document.querySelector('#wp');
        const tel = document.querySelector('#tel');

        email.innerHTML = this.otherContact.email;
        end.innerHTML = this.otherContact.end;
        wp.innerHTML = this.otherContact.wp;
        tel.innerHTML = this.otherContact.tel;

        await sleep(1);
        await this.page.openModal('/pages/modals/contact-details.html', {
            name: 'John Doe',
            phone: '+123456789',
            email: 'john.doe@example.com'
        });
    }

    async afterInit() {
        this.setupEventListeners();
    }
}
