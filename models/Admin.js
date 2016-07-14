'use strict';

const mongoose = require('mongoose');


const adminUserSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: { type: String }
    
},{timestamps: true});

adminUserSchema.methods.validPassword = function(password){
    if(password === this.password) {
        return true;
    }
    return false;
};

const adminUser = mongoose.model('adminUser', adminUserSchema);
module.exports = adminUser;