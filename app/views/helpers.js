// if this was a bigger project, app dir would have it's own dir
// but this is toy so all helpers go here!

var Handlebars     = require('handlebars'),
    moment         = require('moment'),
    COMING         = [{k:'coming', cbv:'I\'m Coming',        nibv:'Coming'}, 
                      {k:'dinner', cbv:'Friday Dinner', nibv:'Friday Dinner'}, 
                      {k:'ribs',   cbv:'I\'m Cooking Ribs',  nibv:'Cooking Ribs'}];

Handlebars.registerHelper('moment', function(dt) {
  var mdate = moment(dt);
  return mdate.fromNow();
});

Handlebars.registerHelper('render_message', function(message) {
  return '<div class="message">\
    <div class="from">\
      <h3>'+message.from+'</h3>\
      <span>'+moment(message.time).fromNow()+'</span>\
    </div>\
    <p>'+message.text+'</p>\
  </div>';
});

Handlebars.registerHelper('coming_checkboxes', function(person) {
  var coming = person.coming;
  return COMING.map(function(cb){
    return '<label class="checkbox inline"><input type="checkbox" name="coming" id="cb-'+person.cacheKey+'-'+cb.k+'" value="'+cb.k+'" '+ (coming && coming.indexOf(cb.k) >= 0 ? 'checked' : '')+'>'+cb.cbv+'</label>';
  }).join("\n");
});

Handlebars.registerHelper('coming_nibs', function(options) {
  var person   = this,
      coming   = person.coming,
      user     = options.hash.user,
      editable = user.party.people.filter(function(p){if (p.cacheKey === person.cacheKey) return 1;}).length>0;
  return COMING.map(function(nib){
    var csscls  = (coming && coming.indexOf(nib.k)>=0) ? 'coming' : '',
        nibHtml = '<span id="nib-'+person.cacheKey+'-'+nib.k+'" class="code '+csscls+'">'+nib.nibv+'</span>';
    return editable  ? '<a class="nib" href="#'+nib.k+'">' + nibHtml + '</a>' : nibHtml;
  }).join(' ');
});

