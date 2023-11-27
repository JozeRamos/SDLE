import { Client } from './models/client.js';

const PORT = process.argv[2] || 5000; // Retrieve port from command line argument

let client = new Client(PORT, null);

(async () => {
    await client.init();

    // Handler method 
    const handler = num => (req, res) => {
        const { method, url, headers, body } = req;
        res.send(`Response from client ${client.port}`);
    }
})();