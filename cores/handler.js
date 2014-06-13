var local = {}
  , jade = require('jade')
  , fs = require("fs")
  , mimeType = {}
  , pages = {}
  , assets = {}
  , local = {}

function home_page(res,home,db,user_session) {
  std_page(res, local.home_page ,db,user_session)
}
// user is the DB entry for the user
function std_page(res,template,db, user_session) {
  var resourceData = { pretty:true }

  local.log({ label:'handler', nodes: [ template ] })


    jade.renderFile( local.viewDir + template +'.jade', resourceData, function( err, page ) {
      if(err)
        missingLayout(res, template, err)
      else {
        res.writeHead(200, {
          'Content-Length': page.length,
          'Content-Type': 'text/html' 
        });
        res.end( page )
      }
    }) 


}

function std_content(res, pathto, file, mime) {
  if( file.lastIndexOf('/') >= 0 )
    file = file.substring( file.lastIndexOf('/') )

  fs.readFile(("" + pathto + file), function(err, data) {
    if (err) return err404( res, err )
    res.writeHead(200, {'content-type':mime})
    res.end(data)
  })
}


// * on error *
function missingLayout(res, name, err) {
  res.end('cand find it')
}
// * on error *
function err404(res, err) {
  res.writeHead(404, {"Content-Type": "text/plain"});
  res.write("404 Not found.");
  res.end();
}
function error(path, page, ext, res) {
  var err = 'not found'
  if(!ext)
    missingLayout( res, path , err)
  else
    err404( res, err )
}

exports.home_page = home_page
exports.std_page = std_page
exports.std_content = std_content
exports.error = error

exports.pathTo = assets
exports.mimeType = mimeType
exports.pagePathTo = pages

exports.locals = local