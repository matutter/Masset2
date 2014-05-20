var env = new Object

  // folders container assets
  env.dir = new Object
	  env.dir.views = 'views/'
	  env.dir.js = 'js/'
	  env.dir.css = 'css/'
	  env.dir.image = 'images/'

  // names of pages passed to view engine
  env.pages = new Object
		env.pages.home = 'home'
		env.pages.error = 'error'
		env.pages.all = [ 'home', 'team', /*'contact',*/ 'parts', 'software', 'progress', 'admin' ]
		env.pages.regular = [ 'home', 'team', /*'contact', */'parts'/*, 'software', 'progress'*/ ]
		env.pages.special = [ 'admin' ]

  // server variables
  env.port = 8888
  env.address = '127.0.0.1'

  // cookie info used in session token exchange
  env.cookie = new Object
	  env.cookie.name = '__mxx2014QUAD'
	  env.cookie.tokenLength = 512

  // database address
  env.db = 'mongodb://127.0.0.1:27017/mxx'

  // for occasional routines 
  env.runLater = []


exports.env = env