# blkChain
A simple blockchain API built with Node.js and WebSockets

The _BlockChain_ class manages interaction with a ledger of shared data - stored as an array of 
`Block`s such that each `Block` contains a piece of data. Along with the stored data each block contains the following information:  

````javascript
let newBlock = {
  timestamp: timestamp || new Date().getTime(),
  index: this.currentBlock.index + 1,
  prevHash: this.currentBlock.hash,
  data: data
};
````

Along with this data is added a computed `hash` whose value depends on all of the stored values for that `Block`. 
The hash function is a 'proof-of-work' function intended to ensure the legitimacy of all data added to the blockchain 
(without the more complicated process of achieving consensus between a portion of the blockchain participants).  

All of the values for the `newBlock` are concatenated along with a variable `nonce` that is incremented until the computed hash 
satisfies a specific condition (one that is easy to verify by other participants in the same blockchain).  

````javascript
while(true) {
  let input = `${timestamp}${index}${prevHash}${data}${nonce}`;
  let hash = crypto.createHash('sha256').update(input).digest('hex');

  if (hash.slice(-3) === '000') return {hash, nonce};
  else nonce++;
}
````
