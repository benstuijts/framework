/* own_modules/utils */

'use strict';
const jsonfile = require('jsonfile');

module.exports = {
    middleware: {
        CRSF: function(token) {
            return function(req,res,next) {
                if(req.method === 'POST') {
                    if(req.body.token === token) {
                        next();
                    } else {
                        res.redirect('/');
                    }
                } else {
                    next();
                }
            };
        } 
        
    },

    randomString: function(len) {
      let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", text="";
      for( var i=0; i < len; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    },

    errorHandling: function(error) {
      if(error) {
        console.log('error: ' + error);
      }
    },
    
    getJsonFile: function(filename, callback) {
        try {
        jsonfile.readFile(filename, function(error, obj) {
            if(error) {
                console.log('error');
                callback(error, null);
            } else {
                console.log('json read: ' + obj);
                callback(null,obj);
            }
        });
        } catch(error) {
        callback(error,null);
        }    
    },
    
    saveJsonFile: function(filename, obj, callback) {
        try {
        jsonfile.writeFile(filename, obj, {spaces: 2},function (error) {
            if(error) {
                throw error;
            } else {
                callback(false);
            }
        });
        } catch(error) {
            callback(error);
        }    
    },
    

};
