//server 
var local = {}
  , qs    = require('querystring')
  , socket= require('./socketHandler')
	, io
	, app

function startup (route, handler, db, session, ip, port) {
	app	= require('http').createServer(onRequest).listen(port, ip)
	io	= require('socket.io').listen(app).sockets.on('connection',function(con){
    socket.onConnection( con )
  })

  local.log({ label:'server', nodes: ['online', ip+':'+port] })

	function onRequest(request, response) {
		route(request,response,handler,db)
	}

}// end startup




exports.startup = startup
exports.locals  = local