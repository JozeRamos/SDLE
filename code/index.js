const Server = require('./models/server.js');

const PORT1 = process.env.PORT || 3000;
const PORT2 = process.env.PORT || 3001;
const PORT3 = process.env.PORT || 3002;

let server1 = new Server(PORT1);
let server2 = new Server(PORT2);
let server3 = new Server(PORT3);

(async () => {
    await server1.init();
    await server2.init();
    await server3.init();
})();
