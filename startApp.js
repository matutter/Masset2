// start app 

var ip    = process.env.OPENSHIFT_NODEJS_IP	|| '127.0.0.1'
	, port  = process.env.OPENSHIFT_NODEJS_PORT	|| '8888'
	, init  = require('./cores/initializer')
	, dbAddr= process.env.OPENSHIFT_APP_NAME


  init.branch = ip

	init.begin( ip, port, dbAddr)