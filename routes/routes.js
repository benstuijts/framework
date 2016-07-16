'use strict';
const express       = require('express');
const router        = express.Router();
const utils         = require('../own_modules/utils');

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
    
    res.locals.add(config);
    
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
    
/* Development only */     
router.get('/home', function(req, res) {
  
    res.render('home', {
        meta: {
            
            
            keywords: ["template"]
        },
        description: "This is a great template for generating a landingpage for an affiliate website. This framework will load very quickly by use of CDN image loading.",
        title: "framework affiliate website",
        css: "framework.css",
        h1: "Framework",
        h2: "Easy & quick site builder, loadingtime < 2s",
        stats: {
            visitorsPerMonth: Math.round(Math.random()*1000+4),
            pages: 10,
            salesPerMonth: Math.round(Math.random()*20+4),
            usersOnline: Math.round(Math.random()*10+1)
        }
    });
});

const paginas = ['/test', '/over', '/contact'];

/* Routing saved pages */
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
