import crypto from 'crypto';

export default class BlockChain {
  constructor() {
    this.chain = [];
    this.currentBlock = {};
    this.genesisBlock = {};
  }

  init(chain) {
    if (chain) {
      if (this.receiveNewChain(chain)) return true;
      else return false;
    }

    this.genesisBlock = {
      timestamp: new Date().getTime(),
      index: 0,
      prevHash: "",
      data: "genesis block",
      hash: '000'
    };

    this.currentBlock = this.genesisBlock;
    this.chain.push(this.genesisBlock);
  }

  createBlock(data, timestamp) {
    let newBlock = {
      timestamp: timestamp || new Date().getTime(),
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
    if (chain[0].data !== 'genesis block') return false;

    for (let i = 1; i < chain.length; i++) {
      if (!isValidBlock(chain[i], chain[i - 1])) return false;
    }

    this.chain = chain;
    this.genesisBlock = chain[0];
    this.currentBlock = chain[chain.length - 1];

    return true;
  }

  rectifyChains(otherChain) {
    let i = 0;

    while(i < this.chain.length || i < otherChain.length) {
      if (
        this.chain[i] === undefined ||
        otherChain[i] === undefined ||
        this.chain[i].hash !== otherChain[i].hash) {

        console.log("Chains mismatched! Consolidating");

        let differingBlocks = this.chain.slice(i).concat(otherChain.slice(i));
        this.receiveNewChain(this.chain.slice(0, i));
        this.consolidateDifferingBlocks(differingBlocks);

        break;
      }
      i++;
    }

    return true;
  }

  consolidateDifferingBlocks(differingBlocks) {
    differingBlocks.sort((block1, block2) => {
      if (block1.timestamp < block2.timestamp) return -1;
      else return 1;
    });

    differingBlocks.forEach((block) => {
      const newBlock = this.createBlock(block.data, block.timestamp);
      this.addToChain(newBlock);
    });
  }

}
