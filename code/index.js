import { Server } from './models/server.js';

const PORT1 = process.env.PORT || 3000;
const PORT2 = process.env.PORT || 3001;
const PORT3 = process.env.PORT || 3002;

let server1 = new Server();
let server2 = new Server();
let server3 = new Server();

(async () => {
    await server1.init(PORT1);
    await server2.init(PORT2);
    await server3.init(PORT3);

    // Handler method 
    const handler = num => (req, res) => {
        const { method, url, headers, body } = req;
        res.send(`Response from server ${num}`);
    }
})();
