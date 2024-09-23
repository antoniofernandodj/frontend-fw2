import { App } from "./app.js";
import { form, contatos, otherContacts, olaMundo } from "./views/index.js";

const app = new App({ selector: '#app', css: '/styles.css' });

app.view({
    path: '/app/form/',
    css: '/pages/form/form.css',
    handler: form
})

app.view({
    path: '/app/ola-mundo/',
    css: '/pages/ola-mundo/ola-mundo.css',
    handler: olaMundo
});

app.view({
    path: '/app/my-contacts/',
    css: '/pages/my-contacts/my-contacts.css',
    handler: contatos
});

app.view({
    path: '/app/other-contacts/',
    css: '/pages/other-contacts/other-contacts.css',
    handler: otherContacts,
})

app.navigate('/app/ola-mundo/');
