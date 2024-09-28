import { App, AppRouter, logout } from "./app.js";

import { contactsGuard } from "./guards/contacts_guard.js";

import { loginController } from "./pages/login/login.js";
import { Contatos } from "./pages/my-contacts/contatos.js";
import { olaMundo } from "./pages/ola-mundo/ola_mundo.js";
import { otherContacts } from "./pages/other-contacts/other_contacts.js";
import { signup } from "./pages/sign-up/signup.js";


const app = new App({
    selector: '#app',
    css: '/styles.css',
    useHistory: false,
});

const router1 = new AppRouter({ css: '/styles.css' });
const router2 = new AppRouter({ css: '/styles.css' });


router1.view({
    path: '/app/login/',
    css: '/pages/login/login.css',
    viewFunction: loginController,
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
    guard: contactsGuard
});

router2.view({
    path: '/app/other-contacts/',
    css: '/pages/other-contacts/other-contacts.css',
    viewFunction: otherContacts,
    guard: () => { return true },
})

router2.view({
    path: '/app/sign-up/',
    viewFunction: signup,
    guard: () => { return true },
})

router2.view({
    path: '/app/logout/',
    viewFunction: () => {
        logout();
        window.alert('Logout realizado com sucesso!')
    },
})

app.includeRouters([ router1, router2 ])

app.navigate('/app/ola-mundo/');
