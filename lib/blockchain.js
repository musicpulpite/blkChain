import bcrypt from 'bcrypt';

export default class BlockChain {
  constructor() {
    this.chain = [];
    this.currentBlock = {};
    this.genesisBlock = {};
  }

  init() {
    this.genesisBlock = {
      timestamp: new Date().getTime(),
      index: 0,
      prevHash: "",
      data: "genesis block"
    };

    this.genesisBlock.hash = this.createHash(this.genesisBlock);
    this.currentBlock = this.genesisBlock;
    this.chain.push(this.genesisBlock);
  }

  createBlock(lastBlock, data) {
    let newBlock = {
      timestamp: new Date().getTime(),
      index: lastBlock.index + 1,
      prevHash: lastBlock.hash,
      data: data
    };

    newBlock.hash = this.createHash(newBlock);

    return newBlock;
  }

  createHash({timestamp, index, prevHash, data}) {
    // Will update later to incorporate proof-of-work function
    // Concatenate all necessary block data. Use index to ensure uniqueness.
    let input = `${timestamp}${index}${prevHash}${data}`;
    let salt = bcrypt.genSaltSync(1);

    return bcrypt.hashSync(input, salt);
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
    debugger
    if (!this.validateHash(newBlock)) return false;

    return true;
  }

  validateHash({timestamp, index, prevHash, data, hash}) {
    // Will update later to incorporate proof-of-work function

    let input = `${timestamp}${index}${prevHash}${data}`;
    return bcrypt.compareSync(input, hash);
  }
}
