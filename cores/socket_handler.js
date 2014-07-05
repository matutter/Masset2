var local = {}
	, socketIO = require('socket.io')
	, sdata = {}

function socketHandler(db, defs) {
	var global = new __globalSocketData

	this.listen = function( httpServer ) {
		socketIO.listen( httpServer ).on('connection', function( socket ){
			var ip = usableIP( socket.handshake.address.address )
			global.current.ip.add( ip )
			handleConnection( socket, ip )
		})
	}//listen


	function handleConnection( socket, ip ) {
		sdata[ ip ] = " asd asd asd "
/*		socket.on('AccountREQ', function(req) {
			var user = new defs.user
			user.create( req.Username, req.Password, req.Email, req.Website )
			user.removePropertyType('function')
			if( user.valid() ) {
				db.collection('user').insert( user, function(err, info){
					if( err ) {
						if( err.code == 11000 )
							socket.emit('AccountDENY', 'Username is unavailable')
						else
							socket.emit('AccountDENY', 'Unknown Error')
					}
					else
						socket.emit('AccountOK', user.name )
				})
			}
		})
		socket.on('LoginREQ', function(req){
			defs.loginDEF(req, function(cred){
				db.collection('user').findOne(cred, function(err, cursor){
					if( err || !cursor ) {
						socket.emit('LoginRES', false)
					} else {
						session.start( cursor.name, ip, function(name, cookie_token){
							socket.emit('LoginRES', cookie_token)
						})
					}
				})
			})
		})*/

		socket.on('disconnect', function(res) {
			global.current.ip.remove( ip )
		})
	}// handleConnection

}// end handler object



function __globalSocketData() {
	this.current = {}
	this.current.ip = new ipStore
}//__globalSocketData

function ipStore () {
	var list = {}
	this.add = function(ip) {
		list[ ip ] = new Date().toJSON()
	}
	this.remove = function(ip) {
		delete list[ip]
	}
	this.toString = function() {
		var s = []
		var n = 0
		for( var i in list ) {
			s.push( (n++) +' '+ i +' '+ list[i] )
		}
		return s
	}
}//ipStore

function usableIP( ip ) {
	if(!ip) return 'error'
	return ip.replace(/\./g,'_')
}


exports.socketHandler = socketHandler
exports.locals  = local