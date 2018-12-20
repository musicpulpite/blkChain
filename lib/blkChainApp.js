import Express from 'express';

import BlockChain from './blockchain.js';
import apiController from './apiController.js';
import nodeController from './nodeController.js';

const app = new Express();
const port = process.env.PORT || Math.floor((Math.random() * 2000) + 1024);

const blkChain = new BlockChain();
blkChain.init();

let node = new nodeController(port + 1, blkChain);
apiController(app, blkChain, node);



app.listen(port, () => console.log(`listening on port: ${port}`));
