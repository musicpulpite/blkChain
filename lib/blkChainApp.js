import Express from 'express';

import BlockChain from './blockchain.js';
import apiController from './apiController.js';
import nodeController from './nodeController.js';

const app = new Express();
const port = process.env.PORT || 3000;

const blkChain = new BlockChain();
blkChain.init();

let node = new nodeController(3001, blkChain);
apiController(app, blkChain, node);



app.listen(port, () => console.log(`listening on port: ${port}`));
