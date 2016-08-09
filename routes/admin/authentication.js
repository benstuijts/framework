'use strict';
const jsonfile = require("jsonfile");
const dateformat = require("dateformat");
const admin         = jsonfile.readFileSync('./config/admin.json');

module.exports = function(router, token) {

router.route('/')
    
    .get(function(req, res){
        res.render("admin/login", {
            token: token
        });
    })
    
    .post(function(req,res){
        let username = req.body.username;
        let password = req.body.password;
        let code = req.body.identificationCode;
        
        let flag_check_admin_user = false;
        for(let i=0; i<admin.length; i++) {
            if(admin[i].username == username && admin[i].password == password) {
                flag_check_admin_user = true;
            }
        }
    
        if(flag_check_admin_user=== true && code === dateformat(new Date(), "ddmmyyyy")) {
            req.session.login = {
                username: username,
                password: password,
                ip: req.ip
            };
            
            res.redirect('/admin/home');   
        } else {
            res.redirect('/');
        }
    });
    
router.get('/logout', function(req, res){
    req.session.login = false;
    res.redirect('/admin');
});    
    
    
    
    return router;
};