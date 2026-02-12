class User {

    constructor(nom, prenom, dateNaissance, mail, password, toDoList = null) {
        this.nom = nom;
        this.prenom = prenom;
        this.dateNaissance = new Date(dateNaissance);
        this.mail = mail;
        this.password = password;
        this.toDoList = toDoList;
    }

    getAge() {
        const today = new Date();
        let age = today.getFullYear() - this.dateNaissance.getFullYear();
        const m = today.getMonth() - this.dateNaissance.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < this.dateNaissance.getDate())) {
            age--;
        }
        return age;
    }

    async validateEmailExternal() {
        try {
            const response = await fetch(`https://api.emailvalidation.io/v1/info?email=${encodeURIComponent(this.mail)}`);
            if (!response.ok) {
                return this.validateEmailBasic();
            }
            const data = await response.json();
            return data.format_valid === true && data.mx_found === true;
        } catch (error) {
            return this.validateEmailBasic();
        }
    }

    validateEmailBasic() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.mail);
    }

    isPasswordValid() {
        if (!this.password) {
            return false;
        }
        if (this.password.length < 8 || this.password.length > 40) {
            return false;
        }
        if (!/[a-z]/.test(this.password)) {
            return false;
        }
        if (!/[A-Z]/.test(this.password)) {
            return false;
        }
        if (!/[0-9]/.test(this.password)) {
            return false;
        }

        return true;
    }

    async isValid() {
        if (this.nom.trim() === '' || this.prenom.trim() === '') {
            return false;
        }
        
        if (this.getAge() < 13) {
            return false;
        }
        const isEmailValid = await this.validateEmailExternal();
        if (!isEmailValid) {
            return false;
        }
        if (!this.isPasswordValid()) {
            return false;
        }

        return true;
    }
    
}

module.exports = User;