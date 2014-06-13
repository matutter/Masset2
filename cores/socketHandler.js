cp = require('child_process')

function onConnection( soc ) {
	try {
		var proc = cp.spawn('execs/a.out',['param1','param2'], null );
			proc.stdout.setEncoding('utf-8');
			proc.stdin.setEncoding('utf-8');

		var writeBuffer = []
			, artificial_latency = 50 
			, writeCRON = setInterval(function(){
			//console.log( proc.connected + '   ' + writeBuffer.length)
			if( /*proc.connected &&*/ writeBuffer.length ) {
				proc.stdin.write( writeBuffer[0] + '\n')
				console.log( 'buffer wrote ' + writeBuffer[0] )
				writeBuffer.shift()				
			}
		}, artificial_latency)

		proc.stdout.on('data',function(stream){
			console.log( proc.pid + ' >> ' + stream )
			//writeBuffer.push( (Number(stream) + 100) )
		})

		proc.stderr.on('data', function(stream) {
			console.log( stream )
		})

		proc.on('close', function(code) {
			console.log('exit ' + code)
		})



	} catch(e) {
		console.log(e)
	}
}

exports.onConnection = onConnection