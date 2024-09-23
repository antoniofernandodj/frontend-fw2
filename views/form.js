import { Page } from "../app.js";

/**
 * @param { Page } page - A instância da classe Page.
 */
export async function form(page) {
    await page.render('/pages/form/form.html');

    await page.handleForm("#form", (data) => {
        window.alert(`Os dados digitados foram ${JSON.stringify(data)}`)
    })

}
