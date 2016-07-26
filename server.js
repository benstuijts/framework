'use strict';
/* Dependencies */
const fs    = require("fs");
const express   = require("express");
const app       = express();
const cookieParser= require('cookie-parser');
const bodyParser  = require('body-parser');
const session     = require('express-session');
const mongoose    = require('mongoose');
const port = process.argv[2] || process.env.PORT || 1000;

const compression = require('compression');
const cacheClient = 86400000 * 14;  // = 2 weken

/* Configuration */

/* Database */
mongoose.connect('localhost:27017/' + process.argv[2]);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

/* View Engine */
app.set('view engine', 'ejs');
app.set('views', './views');
app.set('json spaces', 4);

/* Middleware */
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(session({ secret: 'any string', saveUninitialized: true, resave: true, cookie: { maxAge: 120000 }}));
  app.use(compression());
  app.use(express.static('./public', { maxAge: cacheClient }));
  app.use(function(req,res,next){
    res.locals.add = function(data) {
        for(var key in data) {
            this[key] = data[key];
        }
    };
    res.locals.add({message: null});
    
    next();
  });

/* Routes */
app.use('/admin', require('./routes/admin')('db instance'));
app.use('/', require('./routes/routes')('db instance'));
//app.use('/', require('./routes')('db instance'));

app.listen(port, function () {
  console.log(`Landing page of ${process.argv[2]} listening on port ${port}.`);
});