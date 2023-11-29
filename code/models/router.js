const WebSocket = require('ws');
const routerSocket = new WebSocket.Server({ port: 8080 });

const servers = {}; // List of active servers

routerSocket.on('connection', (server) => {
  // When a server connects, add it to the list of active servers
  servers[server.port] = server;
  
  server.on('message', (message) => {
    // Handle messages from servers if needed
    console.log('Received message from server:', message);
  });

  server.on('close', () => {
    // Remove server from the list of active servers when it disconnects
    delete servers[server.port];
  });
});

// Route to handle client requests for lists
routerSocket.on('message', (clientMessage) => {
  // Here you can process client requests and check the active servers
  // to find the desired list
  const desiredListId = clientMessage.listId;

  for (const port in servers) {
    servers[port].send(desiredListId); // Send the list ID to all servers
  }
});
