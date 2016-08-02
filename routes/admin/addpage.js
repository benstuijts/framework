'use strict';
const utils = require('../../own_modules/utils');
const jsonfile = require('jsonfile');

module.exports = function(router, token) {

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




    