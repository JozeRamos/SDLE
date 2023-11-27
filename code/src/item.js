export class Item {
    constructor(name, desiredQuantity) {
        this.name = name;
        this.desiredQuantity = desiredQuantity;
    }

    changeName(newName) {
        this.name = newName;
    }

    changeDesiredQuantity(newDesiredQuantity) {
        this.desiredQuantity = newDesiredQuantity;
    }

    changeAcquiredQuantity(newAcquiredQuantity) {
        this.acquiredQuantity = newAcquiredQuantity;
    }
}
