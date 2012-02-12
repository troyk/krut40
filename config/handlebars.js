var Handlebars     = require('handlebars'),
    express        = require('express'), // require express before http for proto chain order
    http           = require('http'),
    fs             = require('fs'),
    app            = require('./application'),
    viewDir        = app.rootdir + '/app/views',
    cacheTemplates = app.settings.env === 'production';

app.Handlebars = Handlebars;
var cache = Handlebars.templates = {};

function getTemplate(name, callback) {
  if (typeof cache[name] === 'function') return callback(null,cache[name]);
  fs.readFile(viewDir + '/' + name + '.hbs', 'utf8', function(err,src){
    if (err) return callback(err);
    var compiled = Handlebars.compile(src);
    if (cacheTemplates) cache[name] = compiled;
    callback(null,compiled);
  });
}

// override express's render to be handlebar only
http.ServerResponse.prototype.handlebars = function(name, data) {
  var self   = this,
      locals = (typeof data === 'object') ? Object.create(this.locals,data) : this.locals;
  
  getTemplate(name,function(err,template){
    if (err) return(self.req.next(err));
    self.send(template(locals));
  });
  
};



