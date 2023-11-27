import { ShoppingList } from "./shopping_list.js";
import express from 'express';

export class Client {
    constructor(port, code) {
      this.port = port;
      this.app = express();
      this.code = code;
      this.shopping_list =  new ShoppingList(code, []);
    }

    changeCode(code) {
        this.code = code;
        this.shopping_list.code = code;
    }
}