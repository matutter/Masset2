//server 
var local = {}

function startup (route, handler, sockets, db, defs, session, forms, ip, port) {
	var app	= require('http').createServer(onRequest).listen(port, ip)
    , socketHandler = new sockets.socketHandler(db, defs)

    socketHandler.listen( app )

  	console.log('[] server online ' + defs.getNow())

	function onRequest(request, response) {
		route( request, response, handler, db, session, forms )
	}

}//startup


exports.startup = startup
exports.locals  = local