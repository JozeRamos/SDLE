import { ShoppingList } from "./shopping_list.js";

class Client {
    constructor(code) {
      //this.port = port;
      this.code = code;
      this.shopping_list =  new ShoppingList(code, []);
    }
}