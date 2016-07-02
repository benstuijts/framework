'use strict';
/* Dependencies */
const fs    = require("fs");
const express   = require("express");
const app       = express();
const cookieParser= require('cookie-parser');
const bodyParser  = require('body-parser');
const session     = require('express-session');

const compression = require('compression');
const cacheClient = 86400000 * 14;  // = 2 weken

/* Configuration */

/* Database */

/* View Engine */
app.set('view engine', 'ejs');
app.set('views', './views');

/* Middleware */
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(session({ secret: 'any string', saveUninitialized: true, resave: true, cookie: { maxAge: 120000 }}));
  app.use(compression());
  app.use(express.static('./public', { maxAge: cacheClient }));


/* Routes */
app.use('/admin', require('./routes/admin'));
app.use('/', require('./routes/routes'));

app.listen(8080, function () {
  console.log('Blog listening on port 8080.');
});