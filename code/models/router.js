const WebSocket = require('ws');
const routerSocket = new WebSocket.Server({ port: 8080 });

let currentClient = null;
let listServersInfo = new Map();
let servers = new Map();

function isInt(value) {
  return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
}


routerSocket.on('connection', (connection) => {
  if (connection.protocol.substring(0,6) === 'server') {
    console.log(`Server connected`);
    servers.set(connection.protocol, connection);

    // Handle messages from servers
    connection.on('message', (message) => {
      if(isInt(JSON.parse(message))) {
        console.log('Received list count from server');
        servers.set(connection.protocol, [connection, JSON.parse(message)]);
      }
      if(JSON.parse(message) !== "List not found") {
        console.log('Received list from server');
        currentClient.send(message);
      }
    });

    // Disconnects server and removes it from the list of active servers
    connection.on('close', () => {
      console.log(`Server disconnected`);
      servers.delete(connection.protocol);
    });
    // ...
  } else if (connection.protocol === 'client') {
    console.log(`Client connected`);
    currentClient = connection;

    // Handle messages from clients
    connection.on('message', (message) => {
      console.log(`Received message from client:`, JSON.parse(message));

      if(!listServersInfo.get(JSON.parse(message)[0])) {
        // select the servers with the least list count
        const sortedServers = [...servers.entries()].sort(
          (a, b) => a[1] - b[1] // Sort servers based on their list count
        );

        // Select the first two servers with the least list count
        const selectedServers = sortedServers.slice(0, 2).map((entry) => entry[0]);

        // Save the selected servers for the list code in listServersInfo
        listServersInfo.set(JSON.parse(message)[0], selectedServers);
      }

      if(listServersInfo.get(JSON.parse(message)[0])) {
        // send message to servers
        if(listServersInfo.get(JSON.parse(message)[0])[0]!=null) {
          servers.get(listServersInfo.get(JSON.parse(message)[0])[0])[0].send(message);
        }
        if(listServersInfo.get(JSON.parse(message)[0])[1]!=null) {
          servers.get(listServersInfo.get(JSON.parse(message)[0])[1])[0].send(message);
        }
      }

      // servers.forEach(serverConnection => {
      //   serverConnection.send(message);
      // });
    });

    // Disconnects client
    connection.on('close', () => {
      currentClient = null;
      console.log(`Client disconnected`);
    });
    // ...
  }
});
