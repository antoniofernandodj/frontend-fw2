import { currentUser } from "../app.js";

export const contactsGuard = (nome) => {

    let user = currentUser();

    if (!user) {
        window.alert('rota bloqueada para não logados!');
        return false
    }

    if (user.nome != nome) {
        window.alert(`rota bloqueada para quem não for ${nome}!`);
        return false
    }

    return true
}