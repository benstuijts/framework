'use strict';
const utils = require('../../own_modules/utils');

module.exports = function(router, token) {

router.route('/editjson/:filename?')

    .get(function(req,res){
        let filename = (req.params.filename) ? req.params.filename : "default";
        console.log(filename);
        
        utils.getJsonFile("./config/" + filename + ".json", function(error, data){
            if(error) {
                res.end('error reading file');
            }
            res.render('admin/editjson', {
                data: data,
                filename: filename,
                path: ''
            });
        });
    })
    
    .post(function(req,res){
        let obj = JSON.parse(req.body.json);
        
        let filename = (req.body.path == '') ? "./config/" + req.body.filename + ".json" : "./config" + req.body.path + "/" + req.body.filename + ".json";
        
    
        utils.saveJsonFile(filename, obj, function(error){
            if(error)
                res.end('ERROR: ' + error);
            else 
                res.send('file saved. Return to <a href="/admin">administration area</a> or <a href="/admin/editjson">jsonedit</a>.');
        });
    });

    return router;
};