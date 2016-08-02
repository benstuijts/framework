'use strict';

const jsonfile = require("jsonfile");

const Page = function(filename) {
  
  this.filename = filename || "pages";
  
  this.load = function() {};
  
  this.save = function() {};
  
  this.urls = function() {
      let urls = [];
      Page.list.forEach(function(page){
          urls.push(page.url);
      });
      console.log(urls);
      return urls;
  }
  
  this.init = function() {
      
      jsonfile.readFile('./config/' + filename + '.json', function(error, obj){
          
          obj.forEach(function(page){
              Page.list[page.name] = page;
              console.log(page);
          });
          
          console.log(Page.list);
          
      });
      
      
      
  };
  
  this.update = function() {
      
  };
  
  //this.init();
};

Page.list = {};

module.exports = Page;