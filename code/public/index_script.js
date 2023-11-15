document.addEventListener("DOMContentLoaded", function() {
    const codeButton = document.getElementById("addCode");
    const codeInput = document.getElementById("listCode");
    
    function manageCode(code) {
        // Send a POST request to update the JSON file on the server
        fetch('/manage-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message); // Log the response from the server
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    codeButton.addEventListener("click", function() {
        const code = codeInput.value.trim();
        console.log(code);

        if (code !== "") {
            manageCode(code);
            codeInput.value = "";
        }
    });
});