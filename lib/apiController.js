import bodyParser from 'body-parser';

const apiController = (app, blkChain, nodeController) => {
  app.use(bodyParser.urlencoded({extended: true}));

  // API Endpoints:
  // GET (entire blockchain)
  // GET (individual block by idx)
  // POST (add block to local chain)

  app.post('/chain', (req, res) => {
    let newBlock = blkChain.createBlock(req.body);
    if (blkChain.addToChain(newBlock)) res.send('success!');
    else res.send('failure?!')
  });

  app.get('/chain', (req, res) => {
    let chainData = blkChain.chainData();
    res.send(chainData);
  });

  app.get('/chain/:idx', (req, res) => {
    let blkData = blkChain.blockData(req.params.idx);
    res.send(blkData);
  });
}

export default apiController;
