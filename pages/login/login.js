import { currentUser, login, Page } from "../../app.js";
import { UserRepository } from "../../database.js";
import { MessageBox } from "../../messagebox.js";


// Criando um erro personalizado extendendo a classe Error
class UserNotFoundException extends Error {
    constructor(message) {
        super(message); // Chama o construtor da classe Error
        this.name = 'UserNotFoundException'; // Define o nome do erro
    }
}


class SenhaIncorretaException extends Error {
    constructor(message) {
        super(message); // Chama o construtor da classe Error
        this.name = 'SenhaIncorretaException'; // Define o nome do erro
    }
}


/**
 * @param { Page } page - A instância da classe Page.
 */
export async function loginController(page) {

    let repo = new UserRepository()

    let reply = await MessageBox.warning(
        'Confirmação',
        'Deseja realmente renderizar esta page?'
    );

    if (reply == MessageBox.Cancel) {
        return
    }

    await page.render('/pages/login/login.html');

    await page.handleForm("#form", (data) => {

        let user = repo.findByEmail(data.login)

        if (!user) {
            let msg = 'Usuario não encontrado!'
            window.alert(msg)
            throw new UserNotFoundException(msg)
        }

        if (user.senha == data.senha) {
            login(user)
            window.alert(`Login realizado com sucesso!`)
            window.alert(`Current user: ${JSON.stringify(currentUser())}`)
    
        } else {
            let msg = 'Senha incorreta!'
            window.alert(msg)
            throw new SenhaIncorretaException(msg)
        }
        
    })
    
    page.getLocation((position) => {
        console.log(`Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`);
    });

    // Roteamento com Parâmetros Dinâmicos
    // const userId = page.getParam('id');

    // Formatação e Validação de Dados

    // Incluir suporte a validação de dados nos formulários,
    // permitindo definir regras de validação diretamente no template
    // ou nas views

    // page.validateForm("#form", {
    //     name: { required: true, minlength: 3 },
    //     email: { required: true, email: true }
    // });

    // const data = page.getCache('userData') || await fetchUserData();
    // page.setCache('userData', data);

    // page.uploadFile('#fileInput', {
    //     onProgress: (percentage) => {
    //         console.log(`Progresso: ${percentage}%`);
    //     },
    //     onSuccess: (response) => {
    //         console.log('Upload concluído com sucesso!', response);
    //     },
    //     onError: (error) => {
    //         console.error('Erro no upload:', error);
    //     }
    // });

    // page.enablePushNotifications();

    // page.enableDragAndDrop('#sortable-list', {
    //     onDrop: (item) => console.log('Item dropped:', item)
    // });

    // page.readFile('#fileInput', (fileContent) => {
    //     console.log('Conteúdo do arquivo:', fileContent);
    // });

    // page.registerWebComponent('my-custom-element', class extends HTMLElement {
    //     connectedCallback() {
    //         this.innerHTML = '<p>Componente customizado!</p>';
    //     }
    // });
}
