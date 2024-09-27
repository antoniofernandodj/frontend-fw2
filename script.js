import { App, AppRouter } from "./app.js";

import { form } from "./pages/form/form.js";
import { Contatos } from "./pages/my-contacts/contatos.js";
import { olaMundo } from "./pages/ola-mundo/ola_mundo.js";
import { otherContacts } from "./pages/other-contacts/other_contacts.js";

const app = new App({
    selector: '#app',
    css: '/styles.css',
    useHistory: false,
});

const router1 = new AppRouter({ css: '/styles.css' });
const router2 = new AppRouter({ css: '/styles.css' });


router1.view({
    path: '/app/form/',
    css: '/pages/form/form.css',
    viewFunction: form,
    guard: () => { return true }
})

router1.view({
    path: '/app/ola-mundo/',
    css: '/pages/ola-mundo/ola-mundo.css',
    viewFunction: olaMundo,
    guard: () => { return true }
});

router2.view({
    path: '/app/my-contacts/',
    css: '/pages/my-contacts/my-contacts.css',
    viewFunction: Contatos,
    guard: () => { return true }
});

router2.view({
    path: '/app/other-contacts/',
    css: '/pages/other-contacts/other-contacts.css',
    viewFunction: otherContacts,
    guards: () => { return true },
})

app.includeRouters([ router1, router2 ])

app.navigate('/app/ola-mundo/');
