var local = {}
  , url = require('url')
  , path= require('path')

function router( req, res, handle, db) {
  var pathname = url.parse(req.url).pathname.replace(/\//,'')
  var ext = path.extname(pathname).replace(/\./,'')
  var page = path.basename(pathname)


  local.log({ label:'router', nodes: [{label:"req: "+pathname, nodes:["ext: "+ext,"path: "+pathname]} ] })


  // route assets for known mimetypes
  if( typeof handle.mimeType[ext] === 'string' )
    return handle.std_content(res, handle.pathTo[ ext ], pathname, handle.mimeType[ext])
  else
  // route for regular page
  if( typeof handle.pagePathTo[ page ] === 'function' )
    return handle.pagePathTo[ page ]( res, page, db )
/*  else
  // is it a rare special case?
  if( typeof handle.specialCase[pathname] === 'string')
    return handle.specialCase[pathname](res)*/
  else
    return handle.error(pathname, page, ext, res)
}

exports.route = router
exports.locals  = local