import Websocket from 'ws';

export default class nodeController {
  constructor(port, blkChain) {
    this.wss = new Websocket.Server({port: port});
    this.peerNodes = [];
  }

  addPeer(host, port) {
    let connection = new WebSocket(`wss://${host}:${port}`);

    connection.onerror(error => {
      console.log(`Websocket Error: ${error}`);
    });

    connection.onopen(() => {
      console.log('Connection Established');
      this.initConnection(connection);
    });
  }

  initConnection() {
    this.messageHandler(connection);

    this.peerNodes.push(connection);

    connection.on('error', () => closeConnection(connection));
    connection.on('close', () => closeConnection(connection));
  }

  closeConnection(connection) {
    console.log(`Closing connection: ${connection.url}`);
    this.peerNodes.splice(peerNodes.indexOf(connection), 1);
  }

  messageHandler(connection) {
    connection.on('message', (data) => {
      let msg = JSON.parse(data);
      switch(msg.event) {

      }
    });
  }
  
}
