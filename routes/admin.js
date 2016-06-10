const express       = require('express');
const router        = express.Router();
const bodyParser    = require('body-parser');
const session       = require('express-session');

const token         = randomString(32);

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

router.use(session({
        secret: 'ssshhhhh',
        resave: false,
        saveUninitialized: true,
}));

const isLoggedIn = function(req, res, next) {
        if(!req.session.login) {
            res.redirect('/admin');
        } else {
            next();
        }
};

router.get('/', function(req, res){
    res.render("admin/login", {
        token: token
    });
});

router.post('/login', function(req, res){
    res.send('login posted');
});

router.get('/dashboard', function(req, res){
    res.render("admin/dashboard")
});

router.get('/logout', function(req, res){
    req.session.login = false;
    res.redirect('/admin');
});

module.exports = router;

function randomString(r){for(var n="",t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",a=0;r>a;a++)n+=t.charAt(Math.floor(Math.random()*t.length));return n}

