import Express from 'express';
import bodyParser from 'body-parser';

import BlockChain from './blockchain.js';

// API Endpoints:
// GET (entire blockchain)
// POST (add block to local chain)

const app = new Express();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended: true}));

const blkChain = new BlockChain();
blkChain.init();

app.post('/chain', (req, res) => {
  let newBlock = blkChain.createBlock(blkChain.currentBlock, req.body);
  if (blkChain.addToChain(newBlock)) res.send('success!');
  else res.send('failure?!')
});

app.get('/chain', (req, res) => {
  let chainData = blkChain.chain.map(
    ({timestamp, data}) => {return {timestamp: timestamp, data: data}}
  );
  res.send(chainData);
});

app.listen(port, () => console.log(`listening on port: ${port}`));
