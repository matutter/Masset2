var url = require('url')
var path= require('path')

function router(req,res,handle,db,session, user) {
  var pathname = url.parse(req.url).pathname.replace(/\//,'')
  var ext = path.extname(pathname).replace(/\./,'')
  var base = path.basename(pathname)

  //console.log( '\trouting\t' + pathname + '-' + base + '-' + ext )

  // route assets for known mimetypes
  if( typeof handle.mimeType[ext] === 'string' )
    return handle.std_content(res, handle.assetPath[ext], pathname, handle.mimeType[ext])
  else
  // route for regular page
  if( typeof handle.pagePath[base] === 'function' )
    return handle.pagePath[base](res,base,db,session.checkin(req.headers.cookie) )
  else
  // is it a rare special case?
  if( typeof handle.specialCase[pathname] === 'string')
    return handle.specialCase[pathname](res)
  else
    return handle.error(res, 'can\'t find ' + pathname)
}




exports.route = router