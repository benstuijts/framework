'use strict';
const express       = require('express');
const router        = express.Router();
const adminUser     = require('../models/Admin');
const dateformat    = require('dateformat');

const jsonfile = require('jsonfile');

const utils = require('../own_modules/utils');

jsonfile.readFile("./config/default.json", function(error, obj){
    if(error) console.log(error);
    
});


var request = require('request');

const bodyParser    = require('body-parser');
const session       = require('express-session');
const url           = require('url');
const flash         = require('connect-flash');

const multer        = require('multer');
const crypto        = require('crypto');
const mime          = require('mime');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads/');
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
});

const upload        = multer({ storage: storage });
const token         = randomString(32);
const imagePath     = '../images/uploads/';
const imageListFile = './views/admin/imageList.json';





//const imageList = jsonfile.readFileSync(imageListFile);

const getImageList = function() {
    return new Promise(function(resolve, reject){
        jsonfile.readFile(imageListFile, function(error, list){
            if(error) {
                reject(error);
            } else {
                resolve(list);
            }
        });        
    });
}

const saveImageList = function(list) {
    return new Promise(function(resolve, reject){
        jsonfile.writeFile(imageListFile, list, function(error){
            if(error) {
                reject(error);
            } else {
                resolve(list);
            }
        });
    });
};

function getLandingspage(filename, callback) {
    try {
        jsonfile.readFile(filename, function(error, obj) {
            if(error) {
                console.log('error');
                callback(error, null);
            } else {
                console.log('json read: ' + obj);
                callback(null,obj);
            }
        });
    } catch(error) {
        callback(error,null);
    }
}

function saveLandingPage(filename, obj, callback) {
    try {
        jsonfile.writeFile(filename, obj, function (error) {
            if(error) {
                throw error;
            } else {
                callback(true);
            }
        });
    } catch(error) {
        callback(error);
    }
}

function handleMessage(req) {
    return {
        "success"   : req.flash("success"),
        "info"      : req.flash("info") || req.flash("message"),
        "warning"   : req.flash("warning"),
        "error"     : req.flash("error"),
        "message"   : req.flash("message")
    };
}

/*
router.use(express.static('public'));
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 
*/

module.exports = function(db) {

/* Middleware*/
router.use(session({
        secret: 'ssshhhhh',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 600000
        }
}));



router.use(flash());

router.use(function(req, res, next){
    const _URL = url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl
    });
    
    res.locals.add({
        imagePath: imagePath,
        url: _URL,
        token: token
    });

    next();
});
// Cross Site Request Forgery (CSRF) protection on POST request
router.use(utils.middleware.CRSF(token));

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

router.get('/home', function(req,res){
    res.render('admin/home', {
        username:  'username',
        password:  'password' ,
        ip: '127.0.0.1'
    });
});

router.get('/editlandingspage', function(req, res){
    utils.getJsonFile("./config/default.json", function(error, data){
        if(error) {
            res.end('error reading file');
        }
        res.locals.add({data: data});

        res.render("admin/editlandingspage", {
            username:  'username',
            password:  'password' ,
            ip: '127.0.0.1',
            data: data,
            message: handleMessage(req)
        });
    });
});
router.post('/editlandingspage', function(req, res){
    
    // req.body nog nabewerken!
    let obj = req.body, objNew = {};
    
    // opnemen in utils!
    // Meer informatie op: http://stackoverflow.com/questions/7793811/convert-javascript-dot-notation-object-to-nested-object
    
function parseDotNotation( str, val, obj ){
    var currentObj = obj,
        keys = str.split("."), i, l = keys.length - 1, key;

        for( i = 0; i < l; ++i ) {
        key = keys[i];
        currentObj[key] = currentObj[key] || {};
        currentObj = currentObj[key];
        }

    currentObj[keys[i]] = val;
    delete obj[str];
    }

    Object.expand = function( obj ) {

        for( var key in obj ) {
        parseDotNotation( key, obj[key], obj );
        }
        return obj;
    };
    
    console.log('-----------');
    console.log(Object.expand(req.body));
    console.log('-----------');
    
    console.log('-----------');
    
    for(let prop in obj) {
        
        let level = prop.split("."), i;
        
        if(level.length == 1) {
            if(!objNew[level[0]]) {
                objNew[level[0]] = {};
            }
            objNew[level[0]] = obj[prop];
        }
        if(level.length ==2) {
            if(!objNew[level[0]]) {
                objNew[level[0]] = {};
            }
            if(!objNew[level[0]][level[1]]) {
                objNew[level[0]][level[1]] = {};
            }
            objNew[level[0]][level[1]] = obj[prop];
        }
        if(level.length ==3) {
            if(!objNew[level[0]]) {
                objNew[level[0]] = {};
            }
            if(!objNew[level[0]][level[1]]) {
                objNew[level[0]][level[1]] = {};
            }
            if(!objNew[level[0]][level[1]][level[2]]) {
                objNew[level[0]][level[1]][level[2]] = {};
            }
            objNew[level[0]][level[1]][level[2]] = obj[prop];
        }
        if(level.length ==4) {
            if(!objNew[level[0]]) {
                objNew[level[0]] = {};
            }
            if(!objNew[level[0]][level[1]]) {
                objNew[level[0]][level[1]] = {};
            }
            if(!objNew[level[0]][level[1]][level[2]][level[3]]) {
                objNew[level[0]][level[1]][level[2]][level[3]] = {};
            }
            objNew[level[0]][level[1]][level[2]][level[3]] = obj[prop];
        }
    }
    
    
 
    utils.saveJsonFile('./config/default.json', objNew , function(error){
        if(error) {
            req.flash('danger', 'Wijzigingen NIET opgeslagen.' + error);
            res.redirect('/admin/editlandingspage');
        } else {
            req.flash('success', 'Wijzigingen opgeslagen.');
            res.redirect('/admin/editlandingspage');
        }
        
    });
    
});

router.post('/login', function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    const code = req.body.identificationCode;
    
    if(code === dateformat(new Date(), "ddmmyyyy")) {
        req.session.login = {
            username: username,
            password: password,
            ip: req.ip
        };
        
        res.redirect('/admin/home');   
    } else {
        res.send('not logged in')
    }
});

const renderDashboard = function(req, res) {
    
};

const dashboard = function(req, res) {
    getImageList()
    .then(function(list){
        console.log(handleMessage(req));
        res.render("admin/dashboard", {
            imageList: list,
            message: handleMessage(req) || null,
            token: token
        });
    })
    .catch(function(error){
        res.end("ERROR: " + error );
    });    
};

/*
const dashboard = function(req, res) {
    jsonfile.readFile(imageListFile, function(error, list){
        res.render("admin/dashboard", {
            imageList: list
        });
    });
};
*/

const UPLOADFILE = function(req, res, next) {
    getImageList()
    .then(function(list){
        let filename = req.file.filename;
        list.unshift(filename);
        return saveImageList(list);
    })
    .then(function(list){
        res.render("admin/dashboard", {
            imageList: list
        });
    })
    .catch(function(error){
        res.end("ERROR: " + error );
    });
    
}

const uploadFile = function(req, res, next) {
   jsonfile.readFile(imageListFile, function(error, list){
       
        if(error) {
            console.log('error reading image list.');
        } else {
            let filename = req.file.filename;
            list.unshift(filename);
            console.log(list);
            
            jsonfile.writeFile(imageListFile, list, function(error){
                if(error) {
                    console.log('error writing image list');
                } else {
                    return next();
                }
            });
        }
    }); 
}

router.get('/dashboard', isLoggedIn, dashboard);

router.get('/dashboard/delete-image', function(req, res, next){
    let index = req.query.id;
    getImageList()
    .then(function(list){
        list.splice(index,1);
        return next()
    })
    .catch(function(error) {
        res.end("Error: " + error);
    })
}, dashboard );

//router.post('/dashboard', upload.single('file'), uploadFile, dashboard);
router.post('/dashboard', upload.single('file'), UPLOADFILE);

router.post('/dashboard/upload-file', upload.single('file'), uploadFile, dashboard);

router.post('/dashboard/save-article', function(req, res){
    let title = req.body.title,
        subtitle = req.body.subtitle,
        keywords = req.body.keywords,
        slug = req.body.slug,
        body = req.body.body;
        req.flash('success', 'Article saved...');
        console.log(req.flash('success'));
        res.redirect( req.body.cb);    
});

//router.post('/dashboard/upload-file', upload.single('file'), uploadFile);

/*
router.post('/dashboard/upload-file', upload.single('file'),function(req, res){
    console.log('post received');
    
    jsonfile.readFile('./public/images/uploads/', function(error, list){
        if(error) {
            console.log('error reading image list.');
        } else {
            let filename = req.file.filename;
            list.push(filename);
            console.log(list);
            jsonfile.writeFile('./public/images/uploads/', list, function(error){
                if(error) {
                    console.log('error writing image list');
                } else {
                    res.redirect('./admin/dashboard');
                }
            });
        }
    });
    

    
    
    
});
*/

router.get('/logout', function(req, res){
    req.session.login = false;
    res.redirect('/admin');
});

router.get('*', function(req,res){
    res.redirect('/admin');
});

return router;
}





function randomString(r){for(var n="",t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",a=0;r>a;a++)n+=t.charAt(Math.floor(Math.random()*t.length));return n}

