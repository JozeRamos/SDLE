import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

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
