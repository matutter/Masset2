var   env = require('./env').env
	, crypto = require('crypto')
	, CurrentSession = {}
	, expireTime = 2400000 // = 40 minutes
	, cipher

function salt(i) {
    var s = ''
    var possible = 'ABCDE$FGH(IJKLMNOPQRS-TUVWXYZabcdefghij"klmnopqrstuvwxyz0123456789'
    while(i--)
        s += possible.charAt(Math.floor(Math.random() * possible.length));
    return s
}

function start (db, name, pass, cb) {
	var hash = crypto.createHmac('sha512', module.cipher).update(pass).digest('base64');

	db.collection('users').findOne({name:name,hash:hash}, function(err, cursor) {
		if( err || !cursor) { 
			return cb( 'password or username did not match', undefined )
		}
		else {
			console.log( ' . session start ' )
			session = new Object
			session.key   = salt(env.cookie.tokenLength)
			session.user  = cursor
			session.expire= setTimeout(function() {
				delete CurrentSession[session.key]
			}, expireTime)
			CurrentSession[session.key] = session
			return cb(0, session.key)
		}	
	})

}
//////////////////////// if use presents cookie see if the activity should extend session
function checkin(req) {
	if ( req == undefined ) return undefined

	var pos = req.indexOf(env.cookie.name) + env.cookie.name.length + 1
	var token = req.substr(pos, pos + env.cookie.tokenLength)

	if( CurrentSession[token] != undefined ) {
		console.log(' . session update ')
		delete CurrentSession[token].expire
		CurrentSession[token].expire = setTimeout(function() {
			delete CurrentSession[token]
		}, expireTime)
		return CurrentSession[token] 
	}
	else return undefined
}


/*function backupSession(db) {
	//console.log( CurrentSession )
	db.collection('sessions').insert({last:CurrentSession}, function(err, efct) {
		if( err || !efct ) console.log( err )
	})
}*/

function verify(token) {
	return CurrentSession[token]==undefined?0:1
}
function verify_cookie(cookie) {
	if ( cookie == undefined ) return 0
	var pos = cookie.indexOf(ENV.cookie) + ENV.cookie.length + 1
	var token = cookie.substr(pos, pos+env.cookie.tokenLength)
	return verify(token)
}
function make_cookie(token) {
	var d = new Date();
	d.setTime(d.getTime()+expireTime);
	return env.cookie.name + "=" + token + "; " + "expires=" + d.toGMTString();
}

////////////////////////// recover & initialize state
function recover(db, key) {
	getCipher(db,key, function(err, reccipher) {
		module.cipher = exports.cipher = reccipher
	})
}
function getCipher(db, c_name, cb) {
	db.collection('cipher').findOne({name:c_name}, function(err,cursor) {
		cb( err, cursor.cipher )
	})
}

exports.start = start
exports.cipher = cipher
exports.checkin = checkin
exports.verify = verify
exports.recover = recover
exports.verify_cookie = verify_cookie
exports.cookie = make_cookie
exports.getCipher = getCipher