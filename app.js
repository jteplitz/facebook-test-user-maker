#!/usr/bin/env node
(function(){
  "use strict";

  var generateFbUser = require("./generate_fb_user.js"),
      nconf          = require('nconf').argv().file({ file : './config.json' });

  var options = {
    app_id: nconf.get("app_id"),
    app_sec: nconf.get("app_secret"),
    uname: nconf.get("name")
  };
                 
                 debugger;
  generateFbUser.generateUser(options, function(err, data){
    if (err){
      return console.log("Failed with this error, sorry: ", err);
    }
    console.log('Login URL : ', data.login_url);
    console.log('Token     : ', data.access_token);
    console.log('FB UserID : ', data.id);
  });
}());
