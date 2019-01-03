import WebSocket from 'ws';

export default class nodeController {
  constructor(port, blkChain) {
    this.blkChain = blkChain;
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

    connection.send(
      JSON.stringify({event: "RECTIFY_CHAINS", content: this.blkChain.chain})
    );
  }

  closeConnection(connection) {
    console.log(`Closing connection: ${connection.url}`);
    this.peerNodes.splice(this.peerNodes.indexOf(connection), 1);
  }

  messageHandler(connection) {
    const handler = (data) => {
      let msg = JSON.parse(data);
      switch(msg.event) {

        case "RECEIVE_NEW_BLOCK":
          if (this.blkChain.addToChain(msg.content)) {
            console.log(`New block added: ${msg.content.index}`)
          } else {
            // Rectify chains with sender of message
            // Unlike the rectification that occurs on initial connection,
            // this is only a one-way transaction but I think thats ok
            connection.send(
              JSON.stringify({event: "RECTIFY_CHAINS", content: this.blkChain.chain})
            );
          };
          break;

        case "RECTIFY_CHAINS":
          this.blkChain.rectifyChains(msg.content);
          break;

        default:
          console.log('Invalid message');
      }
    }

    connection.on('message', handler);
  }

  broadcastMessage(event, content) {
    this.peerNodes.forEach((node) => node.send(JSON.stringify({event, content})));
  }
}
