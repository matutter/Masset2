var local = {}
  , url = require('url')
  , path= require('path')

function router( req, res, handle, db, session, forms ) {
  var pathname = url.parse(req.url).pathname.replace(/\//,'')
    , ext = path.extname(pathname).replace(/\./,'')
    , page= path.basename(pathname)
    , peer= null

  /*see all requests by name*/
  //console.log('[] '+pathname)

    console.log( url.parse(req.url,true).query || "none" )


  if( !ext.length && req.connection.remoteAddress || false ) {
    var ip  = req.connection.remoteAddress
      , id  = session.extract( req )

      /*carry out all functions of the session, peer is the users stateful data*/
      session.transact(req, ip, id, pathname, forms, function( peer, err ) {
        if( err ) console.log( err )
        console.log( pathname )
        route(res, handle, pathname, page, ext, db, peer, err )
      })

  } else
    route(res, handle, pathname, page, ext, db, null )


}

function route(res, handle, pathname, page, ext, db, peer, err ) {
  /*route assets for known mimetypes*/
  if( typeof handle.mimeType[ext] === 'string' )
    return handle.std_content(res, handle.pathTo[ ext ], pathname, handle.mimeType[ext], err)
  else
  /*route for regular page*/
  if( typeof handle.pagePathTo[ page ] === 'function' )
    return handle.pagePathTo[ page ]( res, page, db , peer || false, err )
  else
    return handle.error(res, pathname, page, ext, peer, err)
}



exports.route = router
exports.locals  = local