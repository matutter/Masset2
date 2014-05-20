var   env = require('./env').env
	, qs = require('querystring')
	, io
	, app

// ** server args **
// router, for finding path
// handler, for completeing requests
// db, the db that's connected
// session, used for client sessions
function startup (route, handler, db, session) {
	app	= require('http').createServer(onRequest).listen(process.env.PORT || env.port)
	io	= require('socket.io').listen(app, { log: false }).set('log level', 1)
	session.recover(db, 'primary')

	setInterval(function() {
		session.backup(db)
	}, 1 * 60 * 1000);

	startupMessage(app)

	function onRequest(request, response) {
		if (request.method == 'POST') {
			var body = new String
			request.on('data', function(packet) {
				body += packet
			})
		}
		request.on('end', function() {
			validate(qs.parse(body), db, request, session)
		})

		route(request,response,handler,db,session)
	} // END onRequest

	io.sockets.on('connection', function (socket) {
		// login attempt to start a session
		// pre-req session.recover() completed successfully 
		// 1. session.start(DATABASE, USERNAME, PASSWORD, CALLBACK )
		// 2. the CALLBACK(error, session_token )
		//	  token should be given to client in a cookie, default expiration = 40min
		// 3. session.cookie(token) puts the token into a cookie ready object for the client
		socket.on('login',function(s) {
			session.start(db, s.acct, s.pass, function(err, token) {
				if(err)
					console.log(err)
				else
					socket.emit('login', session.cookie(token) )
			})
		})
		// destroy session before user reconnects
		socket.on('logout', function(s) {
			session.end(s.user,s.token)
		})
		// delete something by id given page
		// just moves it to a trash collection
		socket.on('delete', function(s) {
			mongodb = require('mongodb')
			db.collection(s.page).findAndRemove({_id: new mongodb.ObjectID(s.id)}, function(err, cursor) {
				if( err || !cursor ) console.log(err)
				else
					db.collection('trash').insert(cursor, function(err, efct) {
						if(err) console.log( err )
					})
			})
		})


	})
}// end startup

function validate(p, db, req, session) {
	var doc = new Object
	if(p.form == 'parts') { // validate for parts
		if( p.price == '' || p.url == ''|| p.name == '' )
			;//console.log( '******** cant parse *********' )
		else {
			doc.left = new Array
			doc.right= new Array

			for( var param in p) {
				if( p[param].length == 0 ) continue

				if( param.indexOf('left') >= 0  )
					doc.left.push( p[param] )
				else if( param.indexOf('right') >= 0  )
					doc.right.push( p[param] )
				else
					doc[param] = p[param]
			}
			add(doc,db)
		}
	}
	else if(p.form == 'home') {
		add(p,db)
	}

	//for( var rec in doc)
		//console.log( rec + ' -> ' + doc[rec] )
}

function add(doc,db) {
	db.collection(doc.form).insert(doc, function(err,efct) {
		if( !efct ) console.log( err )
	})
}

function startupMessage(app) {
	console.log( '\n* server is online' )
	console.log( '* ' + env.address + ':' + env.port )
}

exports.startup = startup