const lib = require('lib')({ token: process.env.STDLIB_KEY });
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/User');
const Item = require('./models/Item');
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/item');
const app = express();

const Promise = require('bluebird');

function seed(){
    User.findOne({ username: 'bob' }, (err, user) => {
        const item = {
            name: 'hose',
            price: '$4',
            inprogress: false,
            desc: 'hosey',
            duration: 0,
            offerer: {
                id: user._id,
                iid: user.iid,
                username: user.username,
                ready: false
            },
        }
        const item2 = {
            name: 'bike',
            price: '$15',
            inprogress: false,
            desc: 'bikebikebike',
            duration: 0,
            offerer: {
                id: user._id,
                iid: user.iid,
                username: user.username,
                ready: false
            },
        }
        const item3 = {
            name: 'rake',
            price: '$5',
            inprogress: false,
            desc: 'snake',
            duration: 0,
            offerer: {
                id: user._id,
                iid: user.iid,
                username: user.username,
                ready: false
            },
        }
        Item.create(item, (err, item) => {
            console.log(item);
        });
        Item.create(item2, (err, item) => {
            console.log(item);
        });
        Item.create(item3, (err, item) => {
            console.log(item);
        });
    });    
}

// seed();

mongoose.connect(process.env.DB_URL);

app.use(express.static('public'));
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(require("express-session")({
    secret: "anything",
    resave: false,
    saveUninitialized: false
}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passport initialization
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.get('/list', (req, res) => {
    res.render('catalog');
});

app.use(authRoutes);
app.use(itemRoutes);

app.get('/transactions', (req, res) => {
    Item.find({}, (err, items) => {
        let arr = [];
        // couldnt get a proper OR query to work with mongoose :(
        items.forEach(item => {
            if ((item.borrower.username == req.user.username || item.offerer.username == req.user.username) && item.inprogress) {
                arr.push(item);
            }
        });
        res.render('transactions', { items: arr });
    });
});

app.listen(process.env.PORT, process.env.IP, () => {
    console.log(`listening on port ${process.env.PORT}`);
});
