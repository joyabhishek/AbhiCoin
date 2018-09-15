const SHA256 = require('crypto-js/sha256');

class transaction {
  constructor(fromAddress,toAddress,amount){
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timestamp,transactions,previousHash='') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nounce = 0;
    this.hash = "0";
  }

  calculateHash(){
    return SHA256(this.timestamp+JSON.stringify(this.transactions)+this.previousHash+this.nounce).toString();
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
    this.miningReward = 100;
    this.pendingTransactions = [];
    this.difficulty = 2;
  }

  createGenesisBlock(){
    var genesisBlock = new Block('09/07/2018','GenesisBlock',"0");
    console.log("Mining 1st Block......")
    genesisBlock.hash = genesisBlock.mineBlock(2);
    return genesisBlock;
  }

  getLatestBlock(){
    return this.chain[this.chain.length -1];
  }

minePendingTransactions(miningRewardAddress){
  const rewardTx = new transaction(null,miningRewardAddress,this.miningReward);
  this.pendingTransactions.push(rewardTx);
  let newBlock = new Block(Date.now(),this.pendingTransactions,this.getLatestBlock().hash);
  newBlock.hash = newBlock.mineBlock(this.difficulty);
  this.chain.push(newBlock);
  this.pendingTransactions = []
}

createTransaction(transaction){
  this.pendingTransactions.push(transaction)
}

getBalanceOfAddress(address){
  let balance = 0;
  for(const block of this.chain){
    for(const trans of block.transactions){
      if(trans.fromAddress == address){
        balance-=trans.amount;
      }else if(trans.toAddress == address){
        balance+=trans.amount;
      }
    }
  }
  return balance;
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
abhiCoin.createTransaction(new transaction('address1','address2',100))
abhiCoin.createTransaction(new transaction('address2','address3',50))
abhiCoin.createTransaction(new transaction('address3','address1',100))

console.log("Starting the miner.....");
abhiCoin.minePendingTransactions('abhishek')
console.log("My balance is......",abhiCoin.getBalanceOfAddress('abhishek'));

abhiCoin.createTransaction(new transaction('address3','address1',50))
abhiCoin.minePendingTransactions('abhishek')
console.log("My balance is......",abhiCoin.getBalanceOfAddress('abhishek'));
