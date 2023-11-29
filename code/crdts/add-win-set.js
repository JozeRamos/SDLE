//const fs = require('fs');

class AddWinSet {
  constructor(elements = {}) {
    this.elements = elements;
  }

  add(item, quantity) {
    const newSet = new AddWinSet({ ...this.elements });

    if (newSet.contains(item)) {
      newSet.elements[item] += quantity;
    } else {
      newSet.elements[item] = quantity;
    }

    return newSet;
  }

  remove(item, quantityToRemove = 1) {
    const newSet = new AddWinSet({ ...this.elements });
  
    if (newSet.contains(item)) {
      newSet.elements[item] = Math.max(0, newSet.elements[item] - quantityToRemove);
  
      if (newSet.elements[item] === 0) {
        delete newSet.elements[item];
      }
    }
  
    return newSet;
  }

  contains(item) {
    return item in this.elements;
  }

  merge(otherSet) {
    const mergedElements = { ...this.elements };

    for (const [item, quantity] of Object.entries(otherSet.elements)) {
      if (mergedElements.hasOwnProperty(item)) {
        if (quantity > mergedElements[item]) {
          mergedElements[item] = quantity;
        }
        //mergedElements[item] += quantity;
      } else {
        if (!this.contains(item)) {
          mergedElements[item] = quantity;
        }
      }
    }

    return new AddWinSet(mergedElements);
  }
  
  // saveToFile(filename) {
  //   const jsonContent = JSON.stringify(this.elements, null, 2);
  //   fs.writeFileSync(filename, jsonContent);
  //   console.log(`Set saved to ${filename}`);
  // }
}

module.exports = AddWinSet;