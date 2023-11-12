export class Item {
    constructor(name, desiredQuantity, acquiredQuantity) {
        this.name = name;
        this.desiredQuantity = desiredQuantity;
        this.acquiredQuantity = acquiredQuantity;
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
