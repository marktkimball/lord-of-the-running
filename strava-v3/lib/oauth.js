/**
 * Created by austin on 9/22/14.
 */

var util = require('./util')
    , request = require('request')
    , querystring = require('querystring');

var oauth = {};

oauth.getRequestAccessURL = function(args) {

    var url = 'https://www.strava.com/oauth/authorize?'
        , oauthArgs = {
            client_id: '7062' || util.config.client_id
            , redirect_uri: 'http://localhost:3000/auth/strava' || util.config.redirect_uri
            , response_type: 'code'
        };

    if(args.scope)
        oauthArgs.scope = args.scope;
    if(args.state)
        oauthArgs.state = args.state;
    if(args.approval_prompt)
        oauthArgs.approval_prompt = args.approval_prompt;


    var qs = querystring.stringify(oauthArgs);

    url += qs;
    return url;
};

oauth.getToken = function(code,done) {

    var endpoint = 'oauth/token'
        , args = {}
        , form = {
            code: code
            , client_secret: '14a29a0467f0f77c8be1d139c3450907125565c0' || util.config.client_secret || process.env.client_secret
            , client_id: '7062' || util.config.client_id || process.env.client_id
            , access_token: '1e8615666c566a9142c37c9c692ce937b7cc7dd9' || util.config.access_token || process.env.access_token
        };
console.log('form from getToken: ',form);
    args.form = form;
    util.postEndpoint(endpoint,args,done);
};

oauth.deauthorize = function(args,done) {

    var endpoint = 'https://www.strava.com/oauth/deauthorize';

    var url = endpoint
        , options = {
            url: url
            , method: 'POST'
            , json: true
            , headers: {
                Authorization: 'Bearer ' + args.access_token
            }
        };

    request(options, function (err, response, payload) {

        if (!err) {
            //console.log(payload);
        }
        else {
            console.log('api call error');
            console.log(err);
        }

        done(err, payload);
    });
};

module.exports = oauth;
