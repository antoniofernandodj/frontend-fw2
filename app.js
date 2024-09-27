function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function createElement(type, params) {
    const element = document.createElement(type);
    for (let key in params) {
        let value = params[key];
        element.setAttribute(key, value)
    }
    return element
}

function setAttributes(element, params) {
    for (let key in params) {
        let value = params[key];
        element.setAttribute(key, value)
    }
}

export class Page {
    constructor({selector, app}) {
        this.selector = selector
        this.app = app
        this.context = {}
    }

    async handleForm(formSelector, handler) {
        const form = document.querySelector(formSelector);
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                try {
                    await handler(data);
                } catch (e) {
                    console.error(e);
                }
            });
        }
    }

    addEventListeners(events) {
        for (let ev of events) {
            this.addEventListener(ev)
        }
    }

    addEventListener({ type, selector, handler }) {
        const element = document.querySelector(selector);
        if (element) {
            element.addEventListener(type, handler);
        }
    }

    notify(msg, { type, duration }) {
        const notifiers = [...document.querySelectorAll(`template[v-notifier]`)];

        for (let notifier of notifiers) {
            const regex = /\{\{\s*msg\s*\}\}/g;
            let notifierType = notifier.getAttribute('v-type')

            if (notifierType == type) {

                const id = generateUUID()

                const originalContent = notifier.innerHTML;

                notifier.innerHTML = notifier.innerHTML.replace(regex, msg);
                const clone = notifier.content.cloneNode(true);

                const firstElement = clone.firstElementChild;
                if (firstElement) {
                    setAttributes(firstElement, {
                        'id': id,
                        'v-notifier': '',
                        'v-type': notifierType
                    })
                }
                    
                notifier.replaceWith(clone);
                setTimeout(() => {

                    const template = createElement('template', {
                        'v-notifier': '',
                        'v-type': notifierType
                    });

                    template.innerHTML = originalContent;
                    let clonedElement = document.getElementById(id)
                    clonedElement.replaceWith(template);
                    
                }, duration)
            }
        }
    }

    getState() {
        return this.app.getState()
    }

    getCurrentApp() {
        return this.app
    }

    async setState(state) {
        this.app.setState(state)
        await this.app.navigate(
            this.app.getCurrentPath(),
            this.app.getCurrentTitle()
        )
    }

    async addState(newState) {
        let state = this.addEventListener.getState()
        this.app.setState({...state, ...newState})
        await this.app.navigate(
            this.app.getCurrentPath(),
            this.app.getCurrentTitle()
        )
    }

    async render(templatePath, renderContext = {}) {
        this.app.registerLinks()

        this.app.setCurrentTemplate(templatePath)
        this.app.setCurrentTitle(document.title)

        try {
            let contextToInterpolate = { ...this.context, ...renderContext};
            this.app.setCurrentContext(contextToInterpolate);
            
            let html = await this.loadTemplate(templatePath);
            html = this.interpolate(html, contextToInterpolate);

            this.app.setCurrentTitle(
                this.app.getCurrentTitle() || document.title
            )

            let appDiv = document.querySelector(this.selector);
            if (!appDiv) {
                throw new Error(`${this.selector} not found!`);
            }

            appDiv.innerHTML = html;

        } catch (error) {
            console.error(error);
        }
    }

    async loadTemplate(path) {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`
                Failed to load template from
                ${path}: ${response.statusText}
            `);
        }
        return await response.text();
    }

    renderFromTemplateString(templateString, context = {}) {
        const html = this.interpolate(templateString, context);
        let appDiv = document.querySelector(this.selector);
        appDiv.innerHTML = html;
    }

    interpolate(template, context) {
        template = this.replaceSimpleVariables(template, context);
        template = this.replaceObjectLists(template, context);
        return template;
    }
    
    replaceSimpleVariables(template, context) {
        for (const [key, value] of Object.entries(context)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            template = template.replace(regex, value);
        }
        return template;
    }

    isObjectArray(value) {
        return Array.isArray(value) && value.length > 0 && typeof value[0] === 'object'
    }
    
    replaceObjectLists(template, context) {
        for (const [key, value] of Object.entries(context)) {
            if (this.isObjectArray(value)) {
                const regex = new RegExp(`{{#each ${key}}}(.*?){{/each}}`, 'gs');
                template = template.replace(regex, (_, content) => 
                    value.map(item => {
                        let itemHtml = content;
                        for (const [itemKey, itemValue] of Object.entries(item)) {
                            const itemRegex = new RegExp(`{{${itemKey}}}`, 'g');
                            itemHtml = itemHtml.replace(itemRegex, itemValue);
                        }
                        return itemHtml;
                    }).join('')
                );

            } else if (Array.isArray(value)) {
                const regex = new RegExp(`{{#each ${key}}}(.*?){{/each}}`, 'gs');

                template = template.replace(regex, (_, content) =>
                    
                    value.map((item) => {
                        return content.replace(`{{item}}`, item)
                    })
                    .join('')

                );

            }
        }
        return template;
    }

    setContext(context) {
        this.context = { ...this.context, ...context };
    }

    getContext() {
        return this.context;
    }

    setCss(cssFile) {
        const id = 'cssTempCurrentPage'
        const link1 = document.getElementById(id)
        if (link1) {

            if (link1.href == cssFile) {
                return
            }

            link1.href = cssFile;
        } else {
            const link2 = document.createElement('link');
            link2.id = id
            link2.rel = 'stylesheet';
            link2.href = cssFile
            document.head.appendChild(link2);
        }

    }

    showLoading() {
        let appDiv = document.getElementById('app');
        appDiv.innerHTML = '<p>Loading...</p>';
    }

    setTitle(title) {
        document.title = title;
        this.app.setCurrentTitle(title);
    }

    clear() {
        let appDiv = document.querySelector(this.selector);
        appDiv.innerHTML = '';
    }

}


export class App {
    constructor(options = { selector: null, css: null, useHistory: true }) {
        this.options = options

        this.selector = this.options.selector
        this.useHistory = this.options.useHistory;
        this.pages = {};
        this.state = {};

        this.currentPath = null;
        this.currentContext = null;
        this.currentTemplate = null;
        this.currentTitle = null;

        if (this.useHistory) {
            window.addEventListener('popstate', () => {
                this.navigate(this.getCurrentPath(), this.getCurrentTitle());
            });
        }

    }

    includeRouters(routers) {
        for (let router of routers) {
            let paths = []
            for (let path in router.pages) {
                paths.push(path)
            }

            for (let path of paths) {
                let { viewFunction, pageCss, routerCss, guard } = router.pages[path];
                this.view({
                    path: path,
                    css: pageCss,
                    viewFunction: viewFunction,
                    routerCss: routerCss,
                    guard: guard
                });
            }

        }

    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
    }

    getState() {
        return this.state;
    }

    async registerCss(cssFile) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssFile
        document.head.appendChild(link);
    }

    async loadTextFile(path) {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`
                Failed to load template from
                ${path}: ${response.statusText}
            `);
        }
        return await response.text();
    }

    view({ path, viewFunction, css , routerCss, guard }) {
        this.pages[path] = {
            viewFunction: viewFunction,
            pageCss: css,
            routerCss: routerCss,
            guard: guard
        };
    };

    async navigate(name, title) {

        if (this.pages[name]) {
            if (this.useHistory) {
                history.pushState({}, title || '', name);
            }

            this.currentPath = name;
            let page = new Page({ selector: this.selector, app: this })
            let { viewFunction, pageCss, routerCss, guard } = this.pages[name];
            let globalCss = this.options.css

            if (guard) {
                if (!guard()) {
                    console.error('Não deu :(')
                    return
                }
            }

            if (globalCss) {
                this.setAppCss(globalCss)
            }

            if (routerCss) {
                this.setRouterCss(routerCss)
            }

            if (pageCss) {
                page.setCss(pageCss)
            }

            try {

                let view = new viewFunction(page)
                await this.initializeView(view);

            } catch(error) {
                await this.handleViewFunctionFallback(viewFunction, page);
            }

        } else {
            console.error(`page ${name} not found`);
        }
    }

    async initializeView(view) {
        await view.beforeInit();
        await view.init();
        await view.afterInit();
    }

    async handleViewFunctionFallback(viewFunction, page) {
        try {
            await viewFunction(page);
        } catch (error) {
            console.error('Fallback view function failed:', error);
        }
    }

    setAppCss(cssFile) {
        const id = 'cssTempCurrentApp';
        const link1 = document.getElementById(id);
        if (link1) {
            if (link1.href == cssFile) {
                return
            }
            link1.href = cssFile

        } else {

            const link2 = document.createElement('link');
            link2.id = id
            link2.rel = 'stylesheet';
            link2.href = cssFile
            document.head.appendChild(link2);
        }

    }

    setRouterCss(cssFile) {
        const id = 'cssTempCurrentRouter';
        const link1 = document.getElementById(id);
        if (link1) {

            if (link1.href == cssFile) {
                return
            }

            link1.href = cssFile;

        } else {
            const link2 = document.createElement('link');
            link2.id = id;
            link2.rel = 'stylesheet';
            link2.href = cssFile;
            document.head.appendChild(link2);
        }
    }
    
    registerLinks() {

        let links = [
            ...document.querySelectorAll('NavLink'),
            ...document.querySelectorAll('[v-path]')
        ]
    
        links.forEach(link => {
            if (link.listener) {
                link.removeEventListener('click', link.listener);
            }
    
            const handler = (e) => {
                e.preventDefault();
                const path = e.target.getAttribute('v-path');
                let title = link.getAttribute('v-title');
                this.setCurrentTitle(title);
                document.title = title;
                this.navigate(path, title);
            };
    
            link.addEventListener('click', handler);
            link.listener = handler;
        });
    }

    setCurrentContext(currentContext) {
        this.currentContext = currentContext
    }

    setCurrentPath(currentPath) {
        this.currentPath = currentPath
    }

    setCurrentTemplate(currentTemplate) {
        this.currentTemplate = currentTemplate
    }

    setCurrentTitle(currentTitle) {
        this.currentTitle = currentTitle
    }

    getCurrentContext() {
        return this.currentContext
    }

    getCurrentTitle() {
        return this.currentTitle
    }

    getCurrentPath() {
        return this.currentPath
    }

    getCurrentTemplate() {
        return this.currentTemplate
    }

    async render() {
        if (this.currentPath && this.pages[this.currentPath]) {
            await this.navigate(this.currentPath);
        }
    }
}



export class AppRouter {
    constructor(
        options = {
            selector: null,
            css: null
        }
    ) {
        this.options = options;
        this.pages = {};
    }

    view({ path, viewFunction, css, guard }) {
        this.pages[path] = {
            viewFunction: viewFunction,
            pageCss: css,
            routerCss: this.options.css,
            guard: guard
        };
    }
}
