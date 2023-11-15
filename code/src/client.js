import { ShoppingList } from "./shopping_list.js";

export class Client {
    constructor(port, code) {
      this.port = port;
      this.code = code;
      this.shopping_list =  new ShoppingList(code, []);
    }

    changeCode(code) {
        this.code = code;
        this.shopping_list.code = code;
    }
}