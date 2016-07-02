'use strict';
const express       = require('express');
const router        = express.Router();

router.use(function(req, res, next){
    res.locals = {
        author: "Ben Stuijts",
        meta: {
            name: "framework"
        },
        menu: [
            { name: "about", url: ""}, 
            { name: "contact", url: ""}
        ]
    };
    next();
});

router.get('/', function(req, res) {
    res.render('home', {
        title: "",
        description: "",
        keywords: [],
        css: "framework.css",
        h1: "Framework",
        h2: "Easy & quick site builder",
    });
});

module.exports = router;