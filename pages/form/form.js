import { Page } from "../../app.js";

/**
 * @param { Page } page - A instância da classe Page.
 */
export async function form(page) {
    await page.render('/pages/form/form.html');

    await page.handleForm("#form", (data) => {
        window.alert(`Os dados digitados foram ${JSON.stringify(data)}`)
    })

    // page.openModal('/pages/modals/contact-details.html', { contact });
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

    // Suporte a Rotas Protegidas (Autorização)

    // Implementar rotas que só podem ser acessadas se o
    // usuário estiver autenticado ou tiver certas permissões.

    // const data = page.getCache('userData') || await fetchUserData();
    // page.setCache('userData', data);

    // page.goBack();
    // page.goForward();

    // page.uploadFile('#fileInput', {
    //     onProgress: (percentage) => {
    //         page.updateProgressBar(percentage);
    //     },
    //     onSuccess: () => {
    //         page.notify('Upload concluído com sucesso!', { type: 'success' });
    //     }
    // });

    // page.beforeNavigate(async (next) => {
    //     if (page.hasUnsavedChanges()) {
    //         if (!confirm('Você tem mudanças não salvas. Tem certeza que quer sair?')) return;
    //     }
    //     await next();
    // });

    // pageAfterNavigate(async (next) => {
    //     if (page.hasUnsavedChanges()) {
    //         if (!confirm('Você tem mudanças não salvas. Tem certeza que quer sair?')) return;
    //     }
    //     await next();
    // });

    // app.beforeNavigate(async (next) => {
    //     if (app.hasUnsavedChanges()) {
    //         if (!confirm('Você tem mudanças não salvas. Tem certeza que quer sair?')) return;
    //     }
    //     await next();
    // });

    // app.afterNavigate(async (next) => {
    //     if (app.hasUnsavedChanges()) {
    //         if (!confirm('Você tem mudanças não salvas. Tem certeza que quer sair?')) return;
    //     }
    //     await next();
    // });

    // page.enablePushNotifications();

    // login(user.id)

    // page.getLocation((position) => {
    //     console.log(`Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`);
    // });

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
