class Item {
    
    constructor(name, content){
        this.name = name;
        this.content = content;
        this.creationDate = new Date();
    }

    getName(){
        return this.name;
    }

    getContent(){
        return this.content;
    }

    getCreationDate(){
        return this.creationDate;
    }

        isValid() {
        if (!this.name || typeof this.name !== 'string' || this.name.trim().length === 0) {
            return false;
        }
        if (!this.content || typeof this.content !== 'string' || this.content.trim().length === 0) {
            return false;
        }
        if (this.name.length > 1000 || this.content.length > 1000) {
            return false;
        }
        return true;
    }

}

module.exports = Item;