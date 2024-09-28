import { currentUser, login, Page } from "../../app.js";
import { UserRepository, User } from "../../database.js";


class EmailEmUsoException extends Error {
    constructor(message) {
        super(message); // Chama o construtor da classe Error
        this.name = 'EmailEmUsoException'; // Define o nome do erro
    }
}


/**
 * @param { Page } page - A instância da classe Page.
 */
export async function signup(page) {

    await page.render('/pages/sign-up/sign-up.html');

    await page.handleForm("#form", (data) => {

        let repo = new UserRepository()

        if (repo.findByEmail(data.email)) {
            let msg = 'Não foi possível realizar o cadastro, email em uso';
            window.alert(msg)
            throw new EmailEmUsoException(msg)
        }

        let user = new User(data.nome, data.email, data.senha)

        repo.save(user)

        window.alert(`Cadastro realizado com sucesso!`)

    })

}
