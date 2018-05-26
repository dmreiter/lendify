const express = require("express");
const app  = express();
const passport = require("passport");
const User = require("../models/User");
const Item = require('../models/Item');
const lib = require('lib')({ token: process.env.STDLIB_KEY });
const Promise = require('bluebird');

app.post('/item/:id/ready', (req, res) => {
    Item.findOne({ _id: req.params.id }, async (err, item) => {
        if (req.body.ready == 'offerer') {
            item.offerer.ready = item.offerer.ready ? false : true;
        }
        if (req.body.ready == 'borrower') {
            item.borrower.id = req.user._id;
            item.borrower.iid = req.user.iid;
            item.borrower.username = req.user.username;
            item.borrower.ready = item.borrower.ready ? false : true;
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
                
                const exchange = await Promise.fromCallback((cb) =>
                    lib.damianreiter.enghack['@dev'].initiate({value : v, holdFor: 5, uid1: item.offerer.iid, uid2: item.borrower.iid}, (err, result) => {
                        if (err){
                            console.log(err);
                        } else {
                            console.log(result);
                            cb(null, result);
                        }
                }));
                console.log('after');
                item.exchangeId = exchange.id;
                item.holdTime = exchange.duration;
                var date = new Date();
                date.setSeconds(date.getSeconds() + 10);
                date = date.toISOString();
                
                console.log(`ITEM ${item.name} has been traded`);
            } else {
                item.inprogress = false;
                
                    lib.damianreiter.enghack['@dev'].completeContract({exchangeId: item.exchangeId}, (err, result) => {
                        if (err){
                            console.log(err);
                        } else {
                            console.log(result);
                        }
                });
                
                item.borrower = {};
                
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