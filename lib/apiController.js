import bodyParser from 'body-parser';

const apiController = (app, blkChain, node) => {
  app.use(bodyParser.urlencoded({extended: true}));

  // API Endpoints:
  // GET (entire blockchain)
  // GET (individual block by idx)
  // POST (add block to local chain)

  app.post('/chain', (req, res) => {
    let newBlock = blkChain.createBlock(req.body);
    if (blkChain.addToChain(newBlock)) {
      node.broadcastMessage('RECEIVE_NEW_BLOCK', newBlock);
      res.send('Block successfully added');
    }
    else res.send('Failed to add block')
  });

  app.get('/chain', (req, res) => {
    let chainData = blkChain.chainData();
    res.send(chainData);
  });

  app.get('/chain/:idx', (req, res) => {
    let blkData = blkChain.blockData(req.params.idx);
    res.send(blkData);
  });

  // Websocket Controller Endpoints
  // POST (add peer)
  // GET (connections- url and ready state)

  app.post('/peer', (req, res) => {
    const port = req.body.port || 3001;
    const host = req.body.url;
    node.addPeer(host, port);
    res.send();
  });

  app.get('/peer', (req, res) => {
    let peers = node.peerNodes.map(
      (peer) => {return {url: peer.url, readyState: peer.readyState}}
    );
    res.send(peers);
  });
}

export default apiController;
