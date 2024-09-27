import { App, AppRouter } from "./app.js";
import { form, Contatos, otherContacts, olaMundo } from "./views/index.js";

const app = new App({ selector: '#app', css: '/styles.css', useHistory: false });

const router1 = new AppRouter({ css: '/styles.css' });
const router2 = new AppRouter({ css: '/styles.css' });

router1.view({
    path: '/app/form/',
    css: '/pages/form/form.css',
    viewFunction: form
})

router1.view({
    path: '/app/ola-mundo/',
    css: '/pages/ola-mundo/ola-mundo.css',
    viewFunction: olaMundo
});

router2.view({
    path: '/app/my-contacts/',
    css: '/pages/my-contacts/my-contacts.css',
    viewFunction: Contatos
});

router2.view({
    path: '/app/other-contacts/',
    css: '/pages/other-contacts/other-contacts.css',
    viewFunction: otherContacts,
})

app.registerRouters([ router1, router2 ])

app.navigate('/app/ola-mundo/');
