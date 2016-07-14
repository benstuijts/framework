'use strict';
const express       = require('express');
const router        = express.Router();
const config        = require('../config');

module.exports = function(db) {
    
/* Middleware */
router.use(function(req, res, next){
    res.locals.add(config);
    next();
});

router.get('/', function(req, res) {
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
 

    

return router;
};