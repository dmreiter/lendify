//File initiates web3 interface and defines our contract in the ethereum network
var Web3 = require('web');
var web3 = new Web3();
//Setting our provider for the ethereum network
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
//Specify settings for our contract
var ContractFromABI = web3.eth.contract([{"constant":false,"inputs":[{"name":"exchangeId","type":"uint256"}],"name":"completeExchange","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"lenderAddress","type":"address"},{"name":"borrowerAddress","type":"address"},{"name":"duration","type":"uint256"},{"name":"frozenAmount","type":"uint256"}],"name":"createNewExchange","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"exchangeId","type":"uint256"}],"name":"lenderRequestsMoney","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]);
//Specify the id of the contract in our network/ 
var contract = ContractFromABI.at('0xd022b2e644c614bbb8391eae0db5d0182c779882');

/**
* Function to initiate a transaction
* @param {integer} value the sum of eth which needs to be frozen
* @param {integer} holdFor hold item for this long is seconds
* @param {integer} uid1 userid1
* @param {integer} uid2 userid2
* @returns {object}
*/
module.exports = (value = 0, holdFor, uid1, uid2, context, callback) => {
    //create new exchange with lender address, borrower address, amount, and timestamp
    //Value inside the object is the entire value of the item. value*0.95 is the amount of frozen assets (which are returned to the borrower upon completion)
    const exchangeId = contract.createNewExchange(web3.eth.accounts[uid1], web3.eth.accounts[uid2], holdFor, web3.toWei(value*0.95, "ether"), {from: web3.eth.accounts[uid2], value: web3.toWei(value,"ether")});
    callback (null, {id: exchangeId, duration: holdFor});
};
