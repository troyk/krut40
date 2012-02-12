var express     = require('express');
    
process.title = "node-krut40";

var app = module.exports = express();
app.rootdir = __dirname.replace(/\/?config$/,'');
app.db = require('../db');


if (app.settings.env == 'development') {
  app.use(express.logger('dev'));
  app.use(express.static(app.rootdir + '/public')); // NOTE: for production, use nginx ;)
}

app.use(express.cookieParser());
app.use(express.bodyParser());
// check cookie for pid and set locals
app.use(function(req, res, next) {
  var person = app.db.personCache[req.cookies.pid];
  if (person) {
    res.locals.person = person;
    res.locals.parties = app.db.parties;
    res.locals.messages = app.db.messages;
  }
  next(); 
});
app.use(app.router);

require('./handlebars');
require('../app/views/helpers');

app.get('/', function(req, res) {
  res.handlebars('app.html');
}); 

app.post('/login', function(req, res) {
  if (req.body.email) {
    var person = app.db.personByEmail(req.body.email);
    if (person) {
      res.cookie('pid',person.cacheKey,{ maxAge: 86400000 * 90 }); // 90 days
      res.json({pid:person.cacheKey});
      return;
    }
  }
  res.json(null);
});

app.get('/invite/:id', function(req, res) {
  var person = app.db.personCache[req.params.id];
  console.log('id:',req.params.id, ' person:', person);
  if (person) res.cookie('pid',person.cacheKey,{ maxAge: 86400000 * 90 }); // 90 days
  res.redirect('/');
});


app.post('/coming', function(req, res) {
  var coming = req.body.coming;
  res.locals.person.coming =  (Array.isArray(coming) && coming.length <= 3) ? coming : null;
  app.db.save();
  res.json(null);
});

app.post('/message', function(req, res) {
  var message = {
    from: res.locals.person.name,
    party: res.locals.person.party.name,
    time: new Date(),
    text: app.Handlebars.Utils.escapeExpression(String(req.body.message)).replace(/\r/g,'').replace(/\n/g,'<br/>')
  };
  app.db.messages.splice(0,0,message);
  app.db.save();
  res.json({message:message, html:app.Handlebars.helpers.render_message(message)});
});