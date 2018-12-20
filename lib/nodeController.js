import WebSocket from 'ws';

export default class nodeController {
  constructor(port, blkChain) {
    this.wss = new WebSocket.Server({port: port});
    this.peerNodes = [];

    this.wss.on('connection', (connection) => {
     console.log('connection received');
     this.initConnection(connection);
 });
  }

  addPeer(host, port) {
    let connection = new WebSocket(`ws://${host}:${port}/`);

    connection.on('error', error => {
      console.log(`Websocket Error: ${error}`);
    });

    connection.on('open', () => {
      console.log('Connection Established');
      this.initConnection(connection);
    });
  }

  initConnection(connection) {
    this.messageHandler(connection);

    this.peerNodes.push(connection);

    connection.on('error', () => this.closeConnection(connection));
    connection.on('close', () => this.closeConnection(connection));
  }

  closeConnection(connection) {
    console.log(`Closing connection: ${connection.url}`);
    this.peerNodes.splice(this.peerNodes.indexOf(connection), 1);
  }

  messageHandler(connection) {
    connection.on('message', (data) => {
      debugger
      let msg = JSON.parse(data);
      switch(msg.event) {
        // mark this!
        case "test":
          console.log('test successful');
      }
    });
  }

  broadcastMessage(event, message) {
    this.peerNodes.forEach((node) => node.send(JSON.stringify({event, message})));
  }
}
