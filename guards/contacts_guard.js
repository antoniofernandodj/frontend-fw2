import { currentUser } from "../app.js";

export const contactsGuard = () => {

    let user = currentUser();
    console.log((!user))

    if (!user) {
        window.alert('rota bloqueada para não logados!');
        return false
    }

    if (user.nome != 'antonio') {
        window.alert('rota bloqueada para não logados!');
        return false
    }

    return true
}