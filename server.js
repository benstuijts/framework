'use strict';
/* Dependencies */
const fs    = require("fs");
const express   = require("express");
const app       = express();
const cookieParser= require('cookie-parser');
const bodyParser  = require('body-parser');
const session     = require('express-session');
const mongoose    = require('mongoose');
const port = process.argv[2] || process.env.PORT;

const compression = require('compression');
const cacheClient = 86400000 * 14;  // = 2 weken

/* Configuration */

/* Database */
//mongoose.connect('localhost:27017/' + process.argv[2]);
//const db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));
//db.once('open', function() {
//  console.log('Connected to MongoDB');
//});

/* View Engine */
app.set('view engine', 'ejs');
app.set('views', './views2');
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

app.listen(port);

/* -----------------------------------

            TO DO LIST

--------------------------------------

* keywords kunnen toevoegen
* h3 tag vervangen door h2 in abovethefold screen
* 301 redirect toevoegen
    .htaccess
    RewriteCond %{HTTP_HOST} ^www\.example\.com$
    RewriteRule ^/?$ "http\:\/\/example\.com\/" [R=301,L]

* social interactions toevoegen (like...)
* footer vacatures link is niet user friendly
* favicon toevoegen
* server side caching toevoegen (Vanish...)
* expires headers toevoegen
* css minification
* server signature uitzetten

  By default, the Apache webserver sends HTTP headers with some information about your server version, operating system, modules installed, etc. These informations can be used by hackers in order to exploit vulnerabilities (specially if you are running an older version). These information can be hidden or changed with very basic configurations. 
  Open Apache?s configuration file (httpd.conf or apache.conf) and search for ServerSignature. If you find it, edit it to:

    ServerSignature Off
    ServerTokens Prod
  
  If you don't find it, just add these two lines at the end of the file. 
  Note that, after you modify the configuration file, you must restart the Apache server.

* Libwww-perl Access Test
  
  In order to pass this test you must block the libwww-perl user-agent in your .htaccess file.
  If your site is running on apache server, you could put these lines in your .htaccess after RewriteEngine on line:

  .htaccess
  RewriteCond %{HTTP_USER_AGENT} libwww-perl.* 
  RewriteRule .* ? [F,L]

* micro data toevoegen (Schema)

  HTML5 Microdata is an easy way to add semantic markup to your web pages. Search engines rely on this markup to improve the display of search results, making it easier for people to find the right web pages.
  Here is a simple example of how to use HTML5 microdata in your contact web page:
  
    <div itemscope itemtype="http://schema.org/Person">
       <span itemprop="name">Joe Doe</span>
       <span itemprop="company">The Example Company</span>
       <span itemprop="tel">604-555-1234</span>
       <a itemprop="email" href="mailto:joe.doe@example.com">joe.doe@example.com</a>
    </div>

  https://developers.google.com/structured-data/schema-org?hl=end
  
* IP Canonicalization Test

  In order to pass this test you must consider using a 301 re-write rule in your .htaccess file so that your site's IP points to your domain name.
  If your site is running on apache server, you could put these lines in your .htaccess after RewriteEngine on line:

    RewriteCond %{HTTP_HOST} ^XXX\.XXX\.XXX\.XXX
    RewriteRule (.*) http://www.yourdomain.com/$1 [R=301,L]

  Note that you must proper format the first line using your IP (replace X characters with proper digits from your IP) and the second line using your domain name.



*/
