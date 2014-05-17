var server = require('./cores/server')  // where socket io should occur
  , router = require('./cores/router')  // where determining what type of asset should occur
  , handler= require('./cores/handler') // where requests are satisfied
  , session= require('./cores/session') // where cookie parsing and tokens are handled
  , env    = require('./cores/env').env
  , mongodb= require('mongodb')

// path to asset
handler.assetPath['ico'] = env.dir.css    //favicon
handler.assetPath['css'] = env.dir.css    //stylesheets
handler.assetPath['js'] = env.dir.js      //client side javascript
handler.assetPath['png'] = env.dir.image
handler.assetPath['jpg'] = env.dir.image
handler.assetPath['jpeg'] = env.dir.image
handler.assetPath['woff'] = env.dir.css   //bootstrap glyphicons font types
handler.assetPath['ttf'] = env.dir.css    //
handler.assetPath['eot'] = env.dir.css    //
handler.assetPath['svg'] = env.dir.css    //

// mimetype associated with extension
handler.mimeType['ico'] = 'image/x-icon'
handler.mimeType['css'] = 'text/css'
handler.mimeType['js'] = 'text/javascript'
handler.mimeType['png'] = 'image/png'
handler.mimeType['jpg'] = 'image/jpg'
handler.mimeType['jpeg'] = 'image/jpg'
handler.mimeType['woff'] = 'application/x-font-woff'
handler.mimeType['ttf'] = 'application/octet-stream'
handler.mimeType['eot'] = 'font/opentype'
handler.mimeType['svg'] = 'image/svg+xml'

// which template renders for given page
handler.pagePath[''] = handler.home_page
handler.pagePath['home'] = handler.home_page
handler.pagePath['team'] = handler.std_page
handler.pagePath['contact'] = handler.std_page
handler.pagePath['parts'] = handler.std_page
handler.pagePath['software'] = handler.std_page
handler.pagePath['progress'] = handler.std_page
handler.pagePath['admin'] = handler.std_page

handler.specialCase['']

mongodb.connect(env.db, function(err, db_connection){
  server.startup(router.route, handler, db_connection, session)
})