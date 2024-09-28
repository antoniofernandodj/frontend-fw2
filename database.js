export class User {
    constructor(nome, email, senha) {
        this.nome = nome;
        this.senha = senha;
        this.email = email;
        this.id = Date.now();
    }
}

export class UserRepository {
    constructor() {
        this.database = JSON.parse(localStorage.getItem('users')) || [];
    }

    _persist() {
        localStorage.setItem('users', JSON.stringify(this.database));
    }

    findOne(id) {
        return this.database.find(user => user.id == id);
    }

    findByEmail(email) {
        return this.database.find(user => user.email === email);
    }

    save(user) {
        this.database.push(user);
        this._persist();
    }

    remove(id) {
        this.database = this.database.filter(user => user.id !== id);
        this._persist();
    }

    update(id, updatedUser) {
        const index = this.database.findIndex(user => user.id == id);
        if (index !== -1) {
            this.database[index] = { ...this.database[index], ...updatedUser };
            this._persist();
        }
    }
}
