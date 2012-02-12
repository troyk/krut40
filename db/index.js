var fs       = require('fs'),
    data     = require('./data'),
    crypto   = require('crypto'),
    parties  = data.parties,
    messages = data.messages;
    
exports.personCache = {};
exports.data = data;
exports.parties = parties;
exports.messages = messages;
exports.SMTP = data.SMTP;

function emailToCacheKey(email) {
  return crypto.createHash('md5').update(String(email).toLowerCase().trim()+'::Hi Rob ;)').digest("hex");
}
// build person cache
function cachePerson(person,party) {
  var cacheKey = emailToCacheKey(person.email);
  person.__defineGetter__('party',function() { return party; });
  person.__defineGetter__('cacheKey',function() { return cacheKey; });
  exports.personCache[cacheKey] = person;
}
for(var i=0, iLen=parties.length; i<iLen; i++) {
  for (var people=parties[i].people, x=0, xLen=people.length; x<xLen; x++) {
    cachePerson(people[x],parties[i]);
  }
}

exports.personByEmail = function(email) {
  return exports.personCache[emailToCacheKey(email)];
};

exports.save = function() {
  var json = JSON.stringify(data,function(k,v){
    // remove circular references & dynamics
    if (k==='party' || k==='cacheKey') return;
    return v;
  },2);
  fs.writeFile(__dirname+'/data.json',json,'utf8',function(err){
    if (err) {
      console.log('DB: ERROR',err);
      setTimout(function(){exports.save();},500); // try again
    }
  });
};
