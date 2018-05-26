const express = require("express");
const app  = express();
const passport = require("passport");
const User = require("../models/User");
const Item = require('../models/Item');
const lib = require('lib')({ token: process.env.STDLIB_KEY });
const Promise = require('bluebird');

// web3.js contract connection
var Web3 = require('web3');
var web3 = new Web3();
//Setting our provider for the ethereum network
web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/"));
//Specify settings for our contract
var ContractFromABI = web3.eth.contract([{"constant":false,"inputs":[{"name":"exchangeId","type":"uint256"}],"name":"completeExchange","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"lenderAddress","type":"address"},{"name":"borrowerAddress","type":"address"},{"name":"duration","type":"uint256"},{"name":"frozenAmount","type":"uint256"}],"name":"createNewExchange","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"exchangeId","type":"uint256"}],"name":"lenderRequestsMoney","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]);
//Specify the id of the contract on Ethereum network
var contract = ContractFromABI.at('0xd022b2e644c614bbb8391eae0db5d0182c779882');
var exchangeId = 0;


app.post('/item/:id/ready', (req, res) => {
    Item.findOne({ _id: req.params.id }, async (err, item) => {
        if (req.body.ready == 'offerer') {
            item.offerer.ready = item.offerer.ready ? false : true;
        }
        if (req.body.ready == 'borrower') {
            item.borrower.id = req.user._id;
            item.borrower.iid = req.user.iid;
            item.borrower.username = req.user.username;
            item.borrower.ready = true;
            item.duration = req.body.duration;
        }
        
        if (item.inprogress)
            console.log(`user ${req.user.username} has readied for item ${item.name} to be returned as the ${req.body.ready}.`);
        else
            console.log(`user ${req.user.username} has readied for item ${item.name} to be traded as the ${req.body.ready}.`);
        
        const v = parseInt(item.price.match(/\d+/));
        if (item.borrower.ready && item.offerer.ready) {
            console.log(`BOTH USERS READY FOR ITEM ${item.name}`);
            if (!item.inprogress) {
                item.inprogress = true;
                
                // const exchange = await Promise.fromCallback((cb) =>
                //     lib.damianreiter.enghack['@dev'].initiate({value : v, holdFor: item.duration, uid1: item.offerer.iid, uid2: item.borrower.iid}, (err, result) => {
                //         if (err){
                //             console.log(err);
                //         } else {
                //             console.log(result);
                //             cb(null, result);
                //         }
                // }));
                
                //contract.createNewExchange(web3.eth.accounts[item.offerer.iid], web3.eth.accounts[item.borrower.iid], item.duration, web3.toWei(v*0.95, "ether"), function (err, res) {});
                // , {from: web3.eth.accounts[item.borrower.iid], value: web3.toWei(v,"ether")}, function (err, res) {}
                console.log('after');
                // item.exchangeId = exchangeId;
                item.creationTime = Date.now()/1000;
                item.expiryTime = Date.now()/1000 + item.duration;
                item.holdTime = item.duration;
                var date = new Date();
                date.setSeconds(date.getSeconds() + 10);
                date = date.toISOString();
                
                console.log(`ITEM ${item.name} has been traded`);
            } else {
                item.inprogress = false;
                
                //     lib.damianreiter.enghack['@dev'].completeContract({exchangeId: item.exchangeId}, (err, result) => {
                //         if (err){
                //             console.log(err);
                //         } else {
                //             console.log(result);
                //         }
                // });
                
                // complete
                //contract.completeExchange(exchangeId, function (err, res) {});
                
                item.borrower = {};
                item.creationTime = 0;
                item.expiryTime = 0;
                
                console.log(`ITEM ${item.name} has been returned`);
            }

            item.borrower.ready = false;
            item.offerer.ready = false;
        }
        item.save();
        res.redirect('/');
    });
});

module.exports = app;