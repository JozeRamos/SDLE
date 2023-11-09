document.addEventListener("DOMContentLoaded", function() {
    // Get references to the HTML elements
    const shoppingList = document.getElementById("shopping-list");
    const addItemButton = document.getElementById("add");
    const nameInput = document.getElementById("name");
    const desiredQuantityInput = document.getElementById("desired-quantity");

    function addListItem(name, desiredQuantity) {
        // Convert the name to lowercase for comparison
        const lowercaseName = name.toLowerCase();
    
        // Check if an item with the same name already exists
        const existingItem = Array.from(shoppingList.children).find(item => item.dataset.name.toLowerCase() === lowercaseName);
    
        if (existingItem) {
            // If an item with the same name exists, update its quantity
            const existingQuantity = parseInt(existingItem.dataset.quantity);
            const newQuantity = existingQuantity + desiredQuantity;
            existingItem.dataset.quantity = newQuantity;
            existingItem.querySelector(".quantity").textContent = newQuantity; // Update the quantity in the span
            updateQuantity(lowercaseName, newQuantity);
        } else {
            // If no item with the same name exists, create a new list item
            const listItem = document.createElement("li");
            listItem.dataset.name = lowercaseName; // Save the lowercase name in the dataset
            listItem.dataset.quantity = desiredQuantity;
            updateQuantity(lowercaseName, desiredQuantity);
    
            // Create a span to display the quantity
            const quantitySpan = document.createElement("span");
            quantitySpan.textContent = desiredQuantity;
            quantitySpan.className = "quantity";
    
            const capitalizedDisplayName = capitalizeFirstLetter(name);
            listItem.textContent = `${capitalizedDisplayName} (Desired Quantity: `;
    
            // Create buttons to update the quantity
            const increaseButton = document.createElement("button");
            increaseButton.textContent = "+";
            const decreaseButton = document.createElement("button");
            decreaseButton.textContent = "-";
    
            // Add event listeners to the buttons
            increaseButton.addEventListener("click", function() {
                desiredQuantity++;
                listItem.dataset.quantity = desiredQuantity;
                quantitySpan.textContent = desiredQuantity; // Update the quantity in the span
                updateQuantity(lowercaseName, desiredQuantity);
            });
    
            decreaseButton.addEventListener("click", function() {
                desiredQuantity--;
                listItem.dataset.quantity = desiredQuantity;
    
                if (desiredQuantity === 0) {
                    shoppingList.removeChild(listItem); // Remove item if quantity is 0
                    updateQuantity(lowercaseName, 0);
                } else {
                    quantitySpan.textContent = desiredQuantity; // Update the quantity in the span
                    updateQuantity(lowercaseName, desiredQuantity);
                }
            });
    
            // Append the span and buttons to the list item
            listItem.appendChild(quantitySpan);
            listItem.appendChild(increaseButton);
            listItem.appendChild(decreaseButton);
            shoppingList.appendChild(listItem);
        }
    }    
    

    // Function to update the quantity on the server
    function updateQuantity(name, newQuantity) {
        // Send a POST request to update the JSON file on the server
        fetch('/update-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, desiredQuantity: newQuantity }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message); // Log the response from the server
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Function to handle the "Enter" key event
    function handleEnterKey(event) {
        if (event.key === "Enter") {
            addItemButton.click();
        }
    }

    // Add event listener to the "Add" button
    addItemButton.addEventListener("click", function() {
        const name = nameInput.value.trim();
        let desiredQuantity = desiredQuantityInput.value.trim();

        if (name !== "") {
            // Set quantity to 1 if it's empty
            if (desiredQuantity === "") {
                desiredQuantity = 1;
            } else {
                desiredQuantity = parseInt(desiredQuantity);
                if (isNaN(desiredQuantity) || desiredQuantity < 1) {
                    // Invalid quantity, set it to 1
                    desiredQuantity = 1;
                }
            }

            // Create a new list item with quantity buttons and add it to the shopping list
            addListItem(name, desiredQuantity);

            // Clear the input fields
            nameInput.value = "";
            desiredQuantityInput.value = "";
        }
    });

    function fetchInitialData() {
        fetch('/api/shopping-list')
            .then(response => response.json())
            .then(data => {
                for (const itemName in data.items) {
                    const desiredQuantity = data.items[itemName].desiredQuantity;
    
                    // Skip rendering items with a quantity of 0
                    if (desiredQuantity > 0) {
                        const capitalizedItemName = capitalizeFirstLetter(itemName);
                        addListItem(capitalizedItemName, desiredQuantity);
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching initial data:', error);
            });
    }
    
    function capitalizeFirstLetter(str) {
        // Convert special characters to their standard counterparts
        const normalizedStr = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
        // Capitalize the first letter of each word
        const capitalizedStr = normalizedStr.replace(/\b\w/g, c => c.toUpperCase());
    
        return capitalizedStr;
    }
    
    
    

    // Call the function to fetch and display the initial data when the page loads
    fetchInitialData();

    // Add event listener to the input fields for pressing Enter key
    nameInput.addEventListener("keypress", handleEnterKey);
    desiredQuantityInput.addEventListener("keypress", handleEnterKey);
});
