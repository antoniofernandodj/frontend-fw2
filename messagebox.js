const modalHTMLTemplate = `
    <div id="modal">
        <div id="modal-content">
            <img
                src="{{icon}}"
                style="width: 35px;
                height: 35px;
                position: absolute;
                left: 20px;
                top: 20px;"
            >
            <h3>{{title}}</h3>
            <p>{{message}}</p>
            <div class="button-container">{{buttons}}</div>
        </div>
    </div>
`

function mapString(arr, callbackfn) {
    return arr.map(callbackfn).join('')
}


class MessageBoxReply { constructor(value) { this.value = value }};
export class MessageBox {
    static Yes = new MessageBoxReply('Yes');
    static No = new MessageBoxReply('No');
    static Maybe = new MessageBoxReply('Maybe');
    static Ok = new MessageBoxReply('Ok');
    static Cancel = new MessageBoxReply('Cancel');
    static question(title, message, buttons) {
        return this.createModal(title, message, buttons, 'question.png');
    }

    static information(title, message) {
        let buttons = [this.Ok]
        return this.createModal(title, message, buttons, 'info.png');
    }

    static warning(title, message) {
        let buttons = [this.Ok, this.Cancel]
        return this.createModal(title, message, buttons, 'warning.png');
    }

    static critical(title, message) {
        let buttons = [this.Ok]
        return this.createModal(title, message, buttons, 'error.png');
    }

    static success(title, message) {
        let buttons = [this.Ok]
        return this.createModal(title, message, buttons, 'success.png');
    }

    static createModal(title, message, buttons, icon) {
        return new Promise((resolve) => {
            const div = document.createElement('div');
            div.innerHTML = modalHTMLTemplate
                .replace('{{icon}}', `assets/${icon}`)
                .replace('{{title}}', title)
                .replace('{{message}}', message)
                .replace('{{buttons}}', mapString(buttons, button => `
                    <button>${button.value}</button>
                `))

            const modal = div.querySelector('#modal');
            const modalContent = div.querySelector('#modal-content');
            for (let btn of [...div.querySelectorAll('buttons')]) {
                this.setStyle(btn, {
                    "margin": "5px",
                    "padding": "10px 20px",
                    "cursor": "pointer",
                })
            }

            this.setStyle(modalContent, {
                'min-width':  '250px',
                'background-color': 'white',
                'padding': '20px',
                'border-radius':  '5px',
                'position': 'relative',
                'text-align':  'center',
            })

            modal.querySelectorAll('button').forEach((btn, index) => {
                btn.onclick = () => {
                    document.body.removeChild(modal);
                    resolve(buttons[index]);
                };
            });

            document.body.appendChild(modal);

            this.setStyle(modal, {
                'position': 'fixed',
                'z-index': '1000',
                'left': '0',
                'top': '0',
                'width': '100%',
                'height': '100%',
                'background-color': 'rgba(0, 0, 0, 0.5)',
                'display': 'flex',
                'justify-content': 'center',
                'align-items': 'center',
            });
        });
    }

    static setStyle(item, config) {
        for (let key in config) {
            let value = config[key];
            item.style[key] = value;
        }
    }
}

async function showDialogsExample() {
    let reply1 = await MessageBox.question(
        'Confirmação', 'Você deseja continuar?', [
            MessageBox.Yes,
            MessageBox.No,
    ]);

    if (reply1 == MessageBox.No) {
        return
    }

    console.log(`Resposta da caixa de confirmação: ${reply1.value}`);
    await MessageBox.information(
        'Informação', 'Esta é uma mensagem informativa.'
    );

    let reply2 = await MessageBox.warning(
        'Atenção', 'Este é um aviso.'
    );

    if (reply2 == MessageBox.Cancel) {
        return
    };

    console.log(`Resposta da caixa de confirmação: ${reply2.value}`);
    await MessageBox.critical(
        'Erro Crítico', 'Ocorreu um erro crítico!'
    );

    await MessageBox.success(
        'Sucesso', 'A operação foi realizada com sucesso!'
    );

}
