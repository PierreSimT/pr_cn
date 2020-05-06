var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var passport = require('passport');

const User = require('../models/user');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/login', (req, res, next) => {
    console.log(req.body);
    passport.authenticate('login', (err, user, info) => {
        if (err)
            console.log(err);
        if (info != undefined) {
            console.log(info.message);
            res.json({ Error: info.message });
        } else {
            const token = jwt.sign({ id: user.username }, 'secret');
            res.status(200).json({
                auth: true,
                token: token
            });
        }
    })(req, res, next);
})

router.post('/register', (req, res, next) => {
    console.log(req.body);
    passport.authenticate('register', (err, user, info) => {
        if (err)
            console.log(err);
        if (info != undefined) {
            console.log(info.message);
            res.send(info.message);
        } else {
            console.log(user);
            res.send(user);
        }
    })(req, res, next);
})

module.exports = router;
