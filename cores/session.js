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
function end(user,token) {
	if( CurrentSession[token] != undefined )
		if( CurrentSession[token].user.name == user )
			delete CurrentSession[token]
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

////////////////////////// puts all session data into a DB for recovery, call periodically, or on shut down
function backupSession(db) {
	if( CurrentSession == undefined ) return 0
	//console.log( CurrentSession )
	
	var backup = []
	for(var each in CurrentSession) {
		var temp = new Object
		temp.user = CurrentSession[each].user
		temp.key  = CurrentSession[each].key
		backup.push( temp )
	}

	db.collection('sessions').update({backup:"last"},{backup:"last",sessionData:backup}, function(err, efct) {
		if( err || !efct ) console.log( err )
	})
}
////////////////////////// see if token is pre-authorized
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
	db.collection('sessions').findOne({}, function(err,cursor){
		for(var each in cursor.sessionData) {
			CurrentSession[cursor.sessionData[each].key] = cursor.sessionData[each]
			CurrentSession[cursor.sessionData[each].key].expire = setTimeout(function() {
				delete CurrentSession[cursor.sessionData[each].key]
			}, expireTime)
		}
		console.log( '* sessions restored ' )
	})
}
function getCipher(db, c_name, cb) {
	db.collection('cipher').findOne({name:c_name}, function(err,cursor) {
		cb( err, cursor.cipher )
	})
}

exports.end = end
exports.start = start
exports.cipher = cipher
exports.verify = verify
exports.checkin = checkin
exports.recover = recover
exports.cookie = make_cookie
exports.getCipher = getCipher
exports.backup = backupSession
exports.verify_cookie = verify_cookie