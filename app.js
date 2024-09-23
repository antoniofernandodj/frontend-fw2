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

    addEventListener(ev) {
        const element = document.querySelector(ev.selector);
        if (element) {
            element.addEventListener(ev.type, ev.handler);
        }
    }

    getState() {
        return this.app.getState()
    }

    async setState(state) {
        this.app.setState(state)
        await this.app.navigate(this.app.getCurrentPath(), this.app.getCurrentTitle())
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
        this.app.setCurrentPath(window.location.pathname)
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

    async setCss(cssFile) {
        this.removeCss()
        const id = 'cssTempCurrentPage'
        const link = document.createElement('link');
        link.id = id
        link.rel = 'stylesheet';
        link.href = cssFile
        document.head.appendChild(link);
    }

    removeCss() {
        const id = 'cssTempCurrentPage'
        let cssLinkElement = document.getElementById(id)
        if (cssLinkElement) {
            cssLinkElement.remove()
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
    constructor(options = {selector: null, css: null }) {
        this.selector = options.selector
        this.pages = {};
        this.state = {};

        this.currentPath = null;
        this.currentContext = null;
        this.currentTemplate = null;
        this.currentTitle = null;

        window.addEventListener('popstate', () => {
            this.navigate(this.getCurrentPath(), this.getCurrentTitle());
        });

        if (options.css) {
            this.setCss(options.css)
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

    view({path, handler, css}) {
        this.pages[path] = { handler, css };
    }

    async navigate(name, title) {
        if (this.pages[name]) {

            history.pushState({}, title || '', name);
            this.currentPath = name;
            let page = new Page({selector: this.selector, app: this})
            let { handler, css } = this.pages[name];
            page.removeCss()
            if (css) {
                page.setCss(css)
            }
            try {
                await handler(page);
            } catch (e) {
                console.error(e);
            }
        } else {
            console.error(`page ${name} not found`);
        }
    }

    async setCss(cssFile) {
        this.removeCss()
        const id = 'cssTempCurrentApp'
        const link = document.createElement('link');
        link.id = id
        link.rel = 'stylesheet';
        link.href = cssFile
        document.head.appendChild(link);
    }


    async setCssList(cssFiles) {        
        const cls = 'cssTempCurrentAppClass'

        let cssLinkElements = [...document.getElementsByClassName(cls)]
        for (let cssLinkElement of cssLinkElements) {
            cssLinkElement.remove()
        }

        for (let cssFile of cssFiles) {
            const link = document.createElement('link');
            link.setAttribute('class', cls)
            link.rel = 'stylesheet';
            link.href = cssFile
            document.head.appendChild(link);
        }
    }

    removeCss() {
        const id = 'cssTempCurrentApp'
        let cssLinkElement = document.getElementById(id)
        if (cssLinkElement) {
            cssLinkElement.remove()
        }
    }
    
    registerLinks() {

        let links = document.querySelectorAll('NavLink');
    
        links.forEach(link => {
            if (link.listener) {
                link.removeEventListener('click', link.listener);
            }
    
            const handler = (e) => {
                e.preventDefault();
                const path = e.target.getAttribute('href');
                let title = link.getAttribute('title');
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
