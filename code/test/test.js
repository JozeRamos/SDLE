import { AddWinSet } from '../crdts/add-win-set.js';

const json1 = { "banana": 3, "grape": 2, "orange": 5 };
const json2 = { "banana": 1, "grape": 4, "watermelon": 2 };

const set1 = new AddWinSet(json1);
const set2 = new AddWinSet(json2);

const mergedSet = set1.merge(set2);
mergedSet.saveToFile('mergedSet.json');

//-------------------------------------------------------------------

const initialJson = { "apple": 3, "banana": 2, "orange": 5 };

let shoppingList = new AddWinSet(initialJson);
shoppingList = shoppingList.add('banana', 1).add('grape', 4);
shoppingList = shoppingList.remove('orange', 5);
shoppingList.saveToFile('finalSet.json');