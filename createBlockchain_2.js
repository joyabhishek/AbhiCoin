const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(index,timestamp,data,previousHash='') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nounce = 0;
    this.hash = "0";
  }

  calculateHash(){
    return SHA256(this.index+this.timestamp+JSON.stringify(this.data)+this.previousHash+this.nounce).toString();
  }

  mineBlock(difficulty){
    var hash = this.calculateHash();
    while (hash.substring(0,difficulty) !== Array(difficulty+1).join("0")) {
      this.nounce++;
      hash = this.calculateHash();
    }
    console.log("The hash of the block is : "+hash);
    return hash;
  }
}

class Blockchain {
  constructor(){
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock(){
    var genesisBlock = new Block(0,'09/07/2018','GenesisBlock',"0");
    console.log("Mining 1st Block......")
    genesisBlock.hash = genesisBlock.mineBlock(2);
    return genesisBlock;
  }

  getLatestBlock(){
    return this.chain[this.chain.length -1];
  }
  addBlock(newBlock){
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.mineBlock(2);
    this.chain.push(newBlock);
  }

  isChainValid(){
    for (var i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i-1];
      if(currentBlock.hash !== currentBlock.calculateHash()){
        return false;
      }

      if(currentBlock.previousHash !== previousBlock.hash){
        console.log("Current Block prev hash"+currentBlock.previousHash+"Prev Block actual hash"+previousBlock.hash);
        return false;
      }
  }
  return true;
  }

}

let abhiCoin = new Blockchain();
console.log("Mining 2nd Block......")
abhiCoin.addBlock(new Block(1,'09/07/2018',{amount: 4}))
console.log("Mining 3rd Block......")
abhiCoin.addBlock(new Block(2,'09/07/2018',{amount: 10}))
console.log("Is the blockchain valid : "+abhiCoin.isChainValid());
console.log("The block chain is :"+JSON.stringify(abhiCoin,null,4));
