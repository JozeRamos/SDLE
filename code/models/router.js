const WebSocket = require('ws');
const routerSocket = new WebSocket.Server({ port: 8080 });


const servers = []; // List of active servers
var client = null; // List of active clients

routerSocket.on('connection', (connection) => {
  if (connection.protocol === 'server') {
    // Handle server connections
    console.log(`Server connected`);
    servers.push(connection);

    connection.on('message', (message) => {
      // Handle messages from servers if needed
      if(JSON.parse(message)!=="List not found") {
        console.log('Received list from server');
        client.send(message);
      }
    });

    connection.on('close', () => {
      // Remove server from the list of active servers when it disconnects
      const index = servers.indexOf(connection);
      if (index !== -1) {
        servers.splice(index, 1);
        console.log(`Server disconnected`);
      }
    });
    // ...
  } else if (connection.protocol === 'client') {
    // Handle client connections
    console.log(`Client connected`);
    client = connection;

    connection.on('message', (message) => {
          // Handle messages from servers if needed
          console.log(`Received message from client:`, JSON.parse(message));

          servers.forEach(serverConnection => {
            serverConnection.send(message);
          });
        
    });

    connection.on('close', () => {
        console.log(`Client disconnected`);
      
    });
    // ...
  }
});


// routerSocket.on('connection', (server) => {
//   // When a server connects, add it to the list of active servers
//   servers[server.port] = server;
  
//   server.on('message', (message) => {
//       console.log(server.port);
//         // Handle messages from servers if needed
//         console.log(`Received message from server:`, message.toString());
     
//   });

//   server.on('close', () => {
//     // Remove server from the list of active servers when it disconnects
//     delete servers[server.port];
//   });
// });

// // Route to handle client requests for lists
// routerSocket.on('message', (clientMessage) => {
//   // Here you can process client requests and check the active servers
//   // to find the desired list
//   const desiredListId = clientMessage.listId;

//   for (const port in servers) {
//     servers[port].send(desiredListId); // Send the list ID to all servers
//   }
// });
