(function() {
  "use strict";

  var https   = require('https'),
      qsparse = require('querystring'),
      async   = require('async'),

      nconf   = require('nconf').argv().file({ file : './config.json' }),
      app_id  = nconf.get('app_id'),
      app_sec = nconf.get('app_secret'),
      uname   = nconf.get('name'),
      fb_host = 'graph.facebook.com'
  ;

  if( ! app_id || ! app_sec ) { return console.log('Need both your FB App Id and App Secret') }

  var get = function _get( options, cb ) {
    var req = https.get( options, function( res ) {
      var retarr = [];
      res.on( 'data', function( chunk ) { retarr.push( chunk ); });
      res.on( 'end', function() {
        if( res.statusCode !== 200 ) {
          return cb( 'Request failed with error (' + res.statusCode + ') ' );
        }
        
        var retval = retarr.join('');
        cb( null, retval );
      });
    });
    req.on( 'error', function( err  ) {
      cb( err );
    });
  };

  var getAppAccessToken = function get_app_access_token( cb ) {
    var qs = 'client_id='      + app_id
           + '&client_secret=' + app_sec
           + '&grant_type=client_credentials'
           ;
    var opts = {
      hostname : fb_host,
      path     : '/oauth/access_token?' + qs
    };

    get( opts, function( err, retval ) {
      if( err ) { return cb( 'Could not get app access token: ' + err ) }

      var params = qsparse.parse( retval );
      var token  = params.access_token;

      if( ! token ) { return cb( 'No access token: ' + params ) }

      cb( null, token );
    });
  };

  var makeTestUser = function make_test_user( token, cb ) {
    var qs = 'name='          + encodeURI(uname)
           + '&access_token=' + token
           ;
    var opts = {
      hostname : fb_host,
      path     : '/' + app_id + '/accounts/test-users?' + qs
    };

    get( opts, function( err, retval ) {
      if( err ) { return cb( 'Could not get create test user: ' + err ) }

      var data = JSON.parse(retval);
      cb( null, data );
    });
  };

  async.waterfall(
    [
      getAppAccessToken,
      makeTestUser
    ],
    function( err, data ) {
      if( err ) { return console.log( 'Failed with this error, sorry: ', err ) }

      var data_arr = data.data;
      if( ! data_arr || ! data_arr.length ) {
        return console.log( 'Unexpected return: ', data_arr );
      }

      var the_one = data_arr[0]; //there can be only one
      console.log('Login URL : ', the_one.login_url);
      console.log('Token     : ', the_one.access_token);
      console.log('FB UserID : ', the_one.id);
    }
  );
    
}());
