'use strict';
const express       = require('express');
const router        = express.Router();

router.use(function(req, res, next){
    res.locals = {
        author: "Ben Stuijts",
        copyrights: "Digital markets 2016",
        meta: {
            name: "framework",
            facebook: "",
            twitter: "",
            google: "",
            instagram: "",
            pinterest: "",
        },
        menu: [
            { name: "about", url: ""}, 
            { name: "contact", url: ""},
            { name: "main|dropdown"},
            { name: "main.item1", url: ""},
            { name: "main.item2", url: ""}
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
        h2: "Easy & quick site builder, loadingtime < 2s",
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
    }
    
});

module.exports = router;