import crypto from 'crypto';

export default class BlockChain {
  constructor() {
    this.chain = [];
    this.currentBlock = {};
    this.genesisBlock = {};
  }

  init(chain) {
    // need to test
    if (chain) {
      if (this.receiveNewChain(chain)) return true;
      else return false;
    }
    // 

    this.genesisBlock = {
      timestamp: new Date().getTime(),
      index: 0,
      prevHash: "",
      data: "genesis block"
    };

    let provenHash = this.createHash(this.genesisBlock);
    this.genesisBlock.hash = provenHash.hash;
    this.genesisBlock.nonce = provenHash.nonce;

    this.currentBlock = this.genesisBlock;
    this.chain.push(this.genesisBlock);
  }

  createBlock(data) {
    let newBlock = {
      timestamp: new Date().getTime(),
      index: this.currentBlock.index + 1,
      prevHash: this.currentBlock.hash,
      data: data
    };

    let provenHash = this.createHash(newBlock);
    newBlock.hash = provenHash.hash;
    newBlock.nonce = provenHash.nonce;

    return newBlock;
  }

  createHash({timestamp, index, prevHash, data}) {
    let nonce = 1;

    while(true) {
      // Concatenate all necessary block data. Use index to ensure uniqueness.
      // nonce is variable element to achieve proof-of-work
      let input = `${timestamp}${index}${prevHash}${data}${nonce}`;
      let hash = crypto.createHash('sha256').update(input).digest('hex');

      if (hash.slice(-3) === '000') return {hash, nonce};
      else nonce++;
    }
  }

  addToChain(newBlock) {
    if (this.isValidBlock(newBlock, this.currentBlock)) {
      this.chain.push(newBlock);
      this.currentBlock = newBlock;
      return true;
    } else {
      return false;
    }
  }

  isValidBlock(newBlock, prevBlock) {
    if (newBlock.index !== prevBlock.index + 1) return false;
    if (newBlock.prevHash !== prevBlock.hash) return false;
    if (!this.validateHash(newBlock)) return false;

    return true;
  }

  validateHash({timestamp, index, prevHash, data, hash, nonce}) {
    let input = `${timestamp}${index}${prevHash}${data}${nonce}`;
    let calculatedHash = crypto.createHash('sha256').update(input).digest('hex');

    return (calculatedHash === hash && calculatedHash.slice(-3) === '000');
  }

  chainData() {
    return this.chain.map(
      ({timestamp, data}) => {return {timestamp: timestamp, data: data}}
    );
  }

  blockData(idx) {
    let block = this.chain[req.params.idx];
    return {timestamp: block.timestamp, data: block.data};
  }

  receiveNewChain(chain) {
    // need to test
    if (chain[0].data !== 'genesis block') return false;

    for (let i = 1; i < chain.length; i++) {
      if (!isValidBlock(chain[i], chain[i - 1])) return false;
    }

    this.chain = chain;
    this.genesisBlock = chain[0];
    this.currentBlock = chain[chain.length - 1];

    return true;
  }
}
