'use strict';
const express       = require('express');
const router        = express.Router();
const utils         = require('../own_modules/utils');
const http          = require('http');
const fs            = require("fs");
const path          = require("path");




/*
const data          = { author: "Ben Stuijts ingewikkelde '@string...",
        copyrights: "Digital markets 2016",
        meta: {
            url: "http://framework-stuijts.c9users.io",
            name: "framework",
            facebook: "facebook-account",
            twitter: "twitter-account",
            google: "google-account",
            instagram: "",
            pinterest: "",
        }
    };
*/

module.exports = function(db) {
    
/* Middleware */
router.use(function(req, res, next){
    res.locals.add = function(data) {
        for(var key in data) {
            this[key] = data[key];
        }
    };
    
    next();
});

/* Landingpage */    

router.get('/', function(req,res) {
    let pages, menu, algemeen, allWebsites;
    
    getAllDigitalMarketWebsites(req,res)
    .then(function(result){
        allWebsites = result;
        return getMeta(req,res);
    })
    .then(function(result){
        algemeen = result;
        return getMenu(req,res);
    })
    .then(function(result){
        menu = result;
        return getPages(req, res);
    })
    .then(function(result){
        pages = result;
        getLandingsPage(req, res, pages, menu, algemeen, allWebsites);
    })
    .catch(function(error){
        res.end(error);
    });
});



/* Standard Affiliate page */
router.get('/besparen', function(req, res){
    let pages, menu, algemeen, allWebsites;
    
    getAllDigitalMarketWebsites(req,res)
    .then(function(result){
        allWebsites = result;
        return getMeta(req,res);
    })
    .then(function(result){
        algemeen = result;
        return getMenu(req,res);
    })
    .then(function(result){
        menu = result;
        return getPages(req, res);
    })
    .then(function(result){
        pages = result;
        utils.getJsonFile("./config/default.json", function(error, data){
            if(error) {
                res.render('404');
            }
            res.locals.add({data: data});
            
            res.render("affiliate/home", {
                data: data,
                pages: pages,
                menu: menu,
                algemeen: algemeen,
                allWebsites: allWebsites
            });
        });
    })
    .catch(function(error){
        res.end(error);
    });
    
});



/* Routing saved pages */

router.get('*', function(req, res){
    let pages, page, menu, algemeen, allWebsites;
    
    getAllDigitalMarketWebsites(req,res)
    .then(function(result){
        allWebsites = result;
        return getMeta(req,res);
    })
    .then(function(result){
      algemeen = result;
      return getMenu(req,res)
    })
    .then(function(result){
        menu = result;
        return getPages(req,res)
    })
    .then(function(result){
        pages = result;
        return getPage(req, res, pages, menu, algemeen, allWebsites);
    })
    .then(function(result){
        
    })
    .catch(function(error){
        res.end(error);
    })
});




/* Page not found: 404 Page */
router.get('*', function(req, res){
    res.render('404');
});

return router;  
};

const getMeta = function(req,res) {
    return new Promise(function(resolve, reject){
        utils.getJsonFile('./config/algemeen.json', function(error, algemeen){
            if(error) {
                reject(error);
            } else {
                resolve(algemeen);
            }
        });
    });
};

const getMenu = function(req, res) {
    return new Promise(function(resolve, reject){
        utils.getJsonFile('./config/menu.json', function(error, menu){
            if(error) {
                reject(error);
            } else {
                resolve(menu);
            }
        });
    });
}

const getPages = function(req, res) {
    return new Promise(function(resolve, reject){
        fs.readdir('./config/pages', function(error,files){
            if(error) {
                reject(error);
            } else {
                let pages = files.map((file)=>{
                    return path.basename(file, ".json");
                });
                resolve(pages);
            }
        });    
    });
};

const getAllDigitalMarketWebsites = function(req,res) {
    var options = {
        host: 'digitalmarkets.nl',
        path: '/api/getwebsites',
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
     };
    
    return new Promise(function(resolve, reject){
        http.get(options, function(res) {
            res.setEncoding('utf-8');
            let responseString = '';
            res.on('data', function(data) {
              responseString += data;
            });
        
            res.on('end', function() {
              var responseObject = JSON.parse(responseString);
              resolve(responseObject);
            });
            res.on('error', function(error) {
                reject(error);
            });
    });
    });
    
    
};

const getPage = function(req,res, pages, menu, algemeen, allWebsites) {
    return new Promise(function(resolve, reject) {
        let route = req.path.substr(1);
        if(pages.indexOf(route) > -1) {
            utils.getJsonFile('./config/pages/'+ route + '.json', function(error, page){
                if(error) {
                    res.render('404');
                }
                res.render('page/page', {
                    page, 
                    menu: menu,
                    pages: pages,
                    algemeen: algemeen,
                    allWebsites: allWebsites
                });
            });    
        } else {
            res.render('404');
        }
        
    });
};

const getLandingsPage = function(req, res, pages, menu, algemeen, allWebsites) {
    utils.getJsonFile("./config/default.json", function(error, data){
        if(error) {
            res.render('404');
        }
        res.locals.add({data: data});
        
        res.render("landingspage", {
            data: data,
            pages: pages,
            menu: menu,
            algemeen: algemeen,
            allWebsites: allWebsites
        });
    });
};
