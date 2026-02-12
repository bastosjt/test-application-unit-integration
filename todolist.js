class Todolist {

    constructor(user, emailService) {
        this.user = user;
        this.emailService = emailService;
        this.items = [];
    }

    async add(item) {
        if (!(await this.user.isValid())) {
            throw new Error("Utilisateur invalide");
        }
        if (!item.isValid()) {
            throw new Error("Item invalide");
        }
        if (this.items.length >= 10) {
            throw new Error("Todolist pleine (10 items maximum)");
        }
        if (this.hasItemWithName(item.getName())) {
            throw new Error("Item avec ce nom déjà existant");
        }
        if (!this.canAddItem()) {
            throw new Error("Vous devez attendre avant d'ajouter un nouvel item");
        }

        this.items.push(item);

        if (this.items.length === 8) {
            this.emailService.sendEmail(
                this.user.mail,
                "TodoList presque pleine",
                "Attention, votre TodoList est presque remplie ! Vous ne pouvez ajouter que 2 items supplémentaires."
            );
        }

        this.save(item);

    }

    save(item) {
        throw new Error("Méthode non implémentée");
    }

    hasItemWithName(name) {
        return this.items.some(item => item.getName() === name);
    }

    canAddItem() {
        if (this.items.length === 0) {
            return true;
        }
        const lastItem = this.items[this.items.length - 1];
        const now = new Date();
        const timeDiff = now - lastItem.getCreationDate();
        return timeDiff >= 1800000;
    }

}

module.exports = Todolist;