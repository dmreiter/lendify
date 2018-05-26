//File initiates web3 interface and defines our contract in the ethereum network
var Web3 = require('web3');
var web3 = new Web3();
//Setting our provider for the ethereum network
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
//Set the default account to 0 (Our test application only has two accounts. Account 0 will always initiate)
web3.eth.defaultAccount = web3.eth.accounts[0];
//Specify settings for our contract
var ContractFromABI = web3.eth.contract([{"constant":false,"inputs":[{"name":"exchangeId","type":"uint256"}],"name":"completeExchange","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"lenderAddress","type":"address"},{"name":"borrowerAddress","type":"address"},{"name":"duration","type":"uint256"},{"name":"frozenAmount","type":"uint256"}],"name":"createNewExchange","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"exchangeId","type":"uint256"}],"name":"lenderRequestsMoney","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]);
//Specify the id of the contract in our network
var contract = ContractFromABI.at('0xd022b2e644c614bbb8391eae0db5d0182c779882');

/**
// * Function to initiate a transaction
// * @param {integer} exchangeid
// * @returns {integer}
// */
module.exports = (exchangeId = 0, context, callback) => {
  contract.CompleteExchange(exchangeId);
  callback(null, exchangeId);
};
