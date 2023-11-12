import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

export class Item {
    constructor(name, desiredQuantity, acquiredQuantity) {
        this.name = name;
        this.desiredQuantity = desiredQuantity;
        this.acquiredQuantity = acquiredQuantity;
    }

    ChangeName(newName) {
        this.name = newName;
    }

    ChangeDesiredQuantity(newDesiredQuantity) {
        this.desiredQuantity = newDesiredQuantity;
    }

    ChangeDesiredQuantity(newAcquiredQuantity) {
        this.acquiredQuantity = newAcquiredQuantity;
    }
}
