'use strict';
const express       = require('express');
const router        = express.Router();
const utils         = require('../own_modules/utils');
const fs            = require("fs");
const path          = require("path");

/* Load Content of Website */
const menu = require('../config/menu.js');

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

const config = require('../config');

console.log(config.author);



module.exports = function(db) {
    
/* Middleware */
router.use(function(req, res, next){
    res.locals.add = function(data) {
        for(var key in data) {
            this[key] = data[key];
        }
    };
    res.locals.add({menu: menu});
    
    //res.locals.add(config);
    
    next();
});

/* Landingpage */    
router.get('/', function(req,res){
    utils.getJsonFile("./config/default.json", function(error, data){
        if(error) {
            res.end('error reading file');
        }
        res.locals.add({data: data});
        
        res.render("landingspage", {
            data: data
        });
    });
});
    


const paginas = ['/test', '/over', '/contact'];

/* Standard Affiliate page */
router.get('/besparen', function(req, res){
    utils.getJsonFile("./config/default.json", function(error, data){
        if(error) {
            res.end('error reading file');
        }
        res.locals.add({data: data});
        
        res.render("affiliate/home", {
            data: data
        });
    });
});



/* Routing saved pages */

router.get('*', function(req, res){
    fs.readdir('./config/pages', function(error,files){
        
        let pages = files.map((file)=>{
            return path.basename(file, ".json");
        });
        let route = req.path.substr(1);
        
        if(pages.indexOf(route) > -1) {
            utils.getJsonFile('./config/pages/'+ route + '.json', function(error, page){
                res.render('page/page', {
                    page
                });    
            });
        } else {
            res.render('404');
        }
        
        
    });
});


router.get(paginas, function(req,res){
    let route = req.path;
    let pagina = route.replace(/^\/+/, "");
    res.send(pagina);
});

/* Page not found: 404 Page */
router.get('*', function(req, res){
    res.render('404');
});

return router;  
};
