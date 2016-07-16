'use strict';
const express       = require('express');
const router        = express.Router();
const utils         = require('../own_modules/utils');

/* Load Content of Website */
const menu = require('../config/menu.js');

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

const config = require('../config');

console.log(config.author);

//data.replace("'", "komma");

module.exports = function(db) {
    
    router.use(function(req, res, next){
    res.locals.add = function(data) {
        for(var key in data) {
            this[key] = data[key];
        }
    };
    res.locals.add({menu: menu});
    res.locals.add(config);
    
    res.locals.add({data: JSON.stringify(config).replace("'", "&#39;")});
    
    next();
    });
    
    
    
    router.get('/', function(req,res){
        
        //console.log(res.locals);
        
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
    
     
    router.get('/home', function(req, res) {
        
        
       
    res.render('home', {
        title: "framework affiliate website",
        description: "This is a great template for generating a landingpage for an affiliate website. This framework will load very quickly by use of CDN image loading.",
        keywords: ["template"],
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

router.get('/setup/:code', function(req, res){
    let code = req.params.code;
    let setup_code = "bens";
    
    if(code === setup_code) {
        res.render("admin/setup", {
            title: "Setup",
            description: "",
            keywords: [],
            css: "framework.css",
            h1: "Framework",
            h2: "Easy & quick site builder, loadingtime < 2s", 
        });
    } else {
        res.redirect('/');
    }
    
});

router.get('/adjust/:code', function(req, res) {
    let code = req.params.code;
    let setup_code = "bens";
    if(code === setup_code) {
    
        res.send('adjusting existing website');
        
    }
});

return router;  
};
