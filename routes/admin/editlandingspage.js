'use strict';
const utils = require('../../own_modules/utils');
const dateformat = require("dateformat");

module.exports = function(router, token) {

const getData = function(req, res, filename) {
    return new Promise((resolve, reject) => {
        utils.getJsonFile(filename, (error, data)=> {
            if(error) {
                reject("error reading components");
            } else {
                resolve(data)
            }
        });
    });
}

const saveData = function(req, res, obj, filename) {
    return new Promise( (resolve, reject ) => {
        utils.saveJsonFile(filename, obj, (error) => {
            if(error) {
                reject("error writing website data");
            } else {
                resolve(true);
            }    
        });
    });
}

const renderLandingspage = function(req,res, filename) {
    utils.getJsonFile(filename, function(error, data){
            if(error) {
                res.end('error reading file');
            }
            res.locals.add({data: data});
    
            res.render("admin/landingspage/index", {
                username:  'username',
                password:  'password' ,
                ip: '127.0.0.1',
                data: data,
                message: handleMessage(req)
            });
        });
}

router.route('/landingspage')

    .get( (req,res) => {
        let filename = (req.query.backupfile) ? "./config/backup/" + req.query.backupfile : "./config/landingspage.json";
        
        getData(req, res, "./config/components.json")
            .then( (components) => {
                res.locals.add({components:components});
                return getData(req,res, filename);
            })
            .then( (data) => {
                res.locals.add({data:data});
                res.render("admin/landingspage/index", {
                    username:  'username',
                    password:  'password' ,
                    ip: '127.0.0.1',
                    data: data,
                    message: handleMessage(req)
                });
            })
            .catch( (error) => {
                res.end(error);
            });
        
        
    })
    
    .post( (req,res) => {
        let obj = req.body, objNew = {};
    });

router.route('/landingspage/add')
    .get( (req,res) => {
        let filename = (req.query.backupfile) ? "./config/backup/" + req.query.backupfile : "./config/landingspage.json";
        let component = req.query.component;
        getData(req, res, "./config/components.json")
            .then( (components) => {
                res.locals.add({components:components});
                return getData(req,res, filename);
            })
            .then( (data) => {
                // check if component was already added to the website
                let componentAlreadyAdded = false;
                data.components.forEach((c) => {
                    for(let key in c) {
                        if(key == component ) {
                            req.flash('info', 'This component was already added to the website.');
                            componentAlreadyAdded = true;
                        }
                    }
                });
                
                // Add component to website
                if(!componentAlreadyAdded) {
                    res.locals.components.map((comp)=>{
                        if(comp.name == component) {
            
                            let props = comp.properties;
                            // rewrite object
                            let p = {};
                            for(let key in props) {
                                p[key] = props[key].default;
                            }
                            
                            data.components.push({
                                [component]:  p
                            });
                        }
                    });
                    
                }
                
                
                // Save State of website
                saveData(req,res,data, filename)
                    .then( (state) => {
                        // Render adminpage
                res.locals.add({data:data});
                res.render("admin/landingspage/index", {
                    username:  'username',
                    password:  'password' ,
                    ip: '127.0.0.1',
                    data: data,
                    message: handleMessage(req)
                });
                    }).catch( (error) => {
                        res.end(error);
                    });
                
                
                
                
            })
            .catch( (error) => {
                res.end(error);
            });
    });

router.route('/editlandingspage')
    
    .get(function(req, res){
        let filename = (req.query.backupfile) ? "./config/backup/" + req.query.backupfile : "./config/default.json";
        
        utils.getJsonFile(filename, function(error, data){
            if(error) {
                res.end('error reading file');
            }
            res.locals.add({data: data});
    
            res.render("admin/editlandingspage", {
                username:  'username',
                password:  'password' ,
                ip: '127.0.0.1',
                data: data,
                message: handleMessage(req)
            });
        });
    })
    
    .post(function(req,res){
        let obj = req.body, objNew = {};
        

        function parseDotNotation( str, val, obj ){
            var currentObj = obj,
                keys = str.split("."), i, l = keys.length - 1, key;
        
                for( i = 0; i < l; ++i ) {
                key = keys[i];
                currentObj[key] = currentObj[key] || {};
                currentObj = currentObj[key];
                }
        
            currentObj[keys[i]] = val;
            delete obj[str];
            }

        Object.expand = function( obj ) {
            for( var key in obj ) {
                parseDotNotation( key, obj[key], obj );
            }
            return obj;
        };
    
        objNew = utils.expand(req.body);

        let backupDate = dateformat(new Date(), "dd-mm-yyyy-hh.MM.ss");
        let backupfile = './config/backup/' + backupDate + '.json';

        utils.saveJsonFile(backupfile, objNew, function(error){
            if(error) {
                req.flash('danger', 'Wijzigingen NIET opgeslagen.' + error);
                res.redirect('/admin/editlandingspage');
            } else {
                utils.saveJsonFile('./config/default.json', objNew , function(error){
                    if(error) {
                        req.flash('danger', 'Wijzigingen NIET opgeslagen.' + error);
                        res.redirect('/admin/editlandingspage');
                    } else {
                        req.flash('success', 'Wijzigingen opgeslagen.');
                        res.redirect('/admin/editlandingspage');
                    }    
                });    
            }
        });
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
    };
}