'use strict';

const fs    = require("fs");
const express   = require("express");
const app       = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));

app.use('/admin', require('./routes/admin'));

app.listen(8080, function () {
  console.log('Blog listening on port 8080.');
});