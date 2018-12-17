import bcrypt from 'bcryptjs';

export default class BlockChain {
  constructor() {
    this.chain = [];
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

  creatHash({timestamp, index, prevHash, data}) {
    let input = `${timestamp}${index}${prevHash}${data}`;
    let salt = '';
    
    bcrypt.hash(input, salt).then((hash) => {
      return hash;
    });
  }

}
