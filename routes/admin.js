'use strict';
const express       = require('express');
const router        = express.Router();
const fs            = require('fs');
const path          = require('path');

const dateformat    = require('dateformat');
const jsonfile = require('jsonfile');
//const admin         = jsonfile.readFileSync('./config/admin.json');

const utils = require('../own_modules/utils');

//const bodyParser    = require('body-parser');
//const session       = require('express-session');
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

module.exports = function(db) {

/* Middleware*/
router.use(flash());

router.use(function(req, res, next){
    console.log(req.originalUrl);
    if(req.originalUrl === "/admin" || req.originalUrl === "/admin/") {
        next();
    } else {
        
        req.session.login = true;
        
        if(!req.session.login) {
            res.redirect('/admin');
        } else {
            next();
        }
    }
});

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
    req.session.login = true;
        if(!req.session.login) {
            res.redirect('/admin');
        } else {
            next();
        }
};

/* AUTHENTICATION */
require("./admin/authentication")(router, token);

/* EDITJSON */
require("./admin/editjson")(router, token);

/* HOME (MENU) */
router.get('/home', isLoggedIn, function(req,res){
    
    fs.readdir('./config/pages', function(error,files){
        
        let pages = files.map((file)=>{
            return path.basename(file, ".json");
        });
        
        res.render('admin/home', {
            username:  'username',
            password:  'password' ,
            ip: '127.0.0.1',
            pages
        });
        
    });
    
    
});

/* EDITLANDINGSPAGE */
require("./admin/editlandingspage")(router, token);

/* ADD PAGE */
require("./admin/addpage")(router, token);

router.get('/json', isLoggedIn, function(req,res){
    res.locals.pretty = true;
    utils.getJsonFile("./config/default.json", function(error, data){
        if(error) {
            res.end('error reading file');
        }
        res.json(data);
    });
});

router.get('/backupfiles', isLoggedIn, function(req,res){
    fs.readdir('./config/backup', function(error, files){
        
        res.render("admin/backupfiles", {
            files: files.reverse()
        })
    });
    
});

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



router.get('*', function(req,res){
    res.redirect('/admin');
});

return router;
}





function randomString(r){for(var n="",t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",a=0;r>a;a++)n+=t.charAt(Math.floor(Math.random()*t.length));return n}

