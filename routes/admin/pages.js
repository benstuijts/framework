'use strict';
const utils = require('../../own_modules/utils');
const jsonfile = require('jsonfile');
const fs = require('fs');
const path = require('path');

module.exports = function(router, token) {

router.route('/backuppages')
    
    .get( (req,res) => {
        fs.readdir('./config/pages', function(error,files){
        
            let pages = files.map((file)=>{
                return path.basename(file, ".json");
            });
            
            let html = '<h1>Pages</h1>';
            for(let index=0; index<pages.length; index++) {
                html += '<a href="/admin/editjsonpage/'+pages[index]+'">'+pages[index]+'</a>';
            }
            res.end(html);
        });
    });

router.route('/editjsonpage/:filename?')

    .get( (req,res) => {
        let filename = (req.params.filename) ? req.params.filename : "default";
        
        utils.getJsonFile("./config/pages/" + filename + ".json", function(error, data){
            if(error) {
                res.end('error reading file');
            }
            res.render('admin/editjson', {
                data: data,
                filename: filename,
                path: '/pages'
            });
        });
    });


router.route('/addpage')
    
    .get((req, res) => {
        let filename = (req.query.pagename) ? "./config/pages/" + req.query.pagename + ".json" : "";
        if(filename!="") {
            utils.getJsonFile(filename, function(error, data){
                if(error) {
                    res.end('error reading file');
                }
                res.locals.add({data: data});
                res.render('admin/addpage', {
                    data:data,
                    message: handleMessage(req)
                });
            }); 
        } else {
            res.render('admin/addpage', {
                data: {},
                message: handleMessage(req)
            });
        }
    })
    
    .post(function(req, res){
        
        let filename = "./config/pages/" + req.body.url.substr(1) + ".json";
    
        utils.saveJsonFile(filename, req.body, function(error){
            if(error) {
                req.flash('danger', 'Wijzigingen NIET opgeslagen.' + error);
                res.redirect('/admin/addpage');
            } else {
                req.flash('success', 'Wijzigingen opgeslagen.');
                res.redirect('/admin/addpage');
            }
            
        });
        
    })
    
    .delete(function(req, res){
        
    });
  
    
    return router;  
};

function handleMessage(req) {
    return {
        "success"   : req.flash("success"),
        "info"      : req.flash("info") || req.flash("message"),
        "warning"   : req.flash("warning"),
        "error"     : req.flash("error"),
        "message"   : req.flash("message")
    
    }
}

/* routing pages: 
    
    get.arrayOfpages -> render page(naam) -> kan de pagina's opslaan als losse json files op naam van de page... gemakkelijk
    om arrayOfPages te maken wellicht.
    
*/




    