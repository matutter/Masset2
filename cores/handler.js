var env= require('./env').env
  , jade = require('jade')
  , fs = require("fs")
  , mimeType = {}
  , pages = {}
  , assets = {}
  , special = {}
  , local = {}

function home_page(res,home,db,session,user) {
  std_page(res,env.pages.home,db,session,user)
}

function std_page(res,pathname,db,session, user) {
	console.log( '* ' + env.dir.views + pathname + '.jade' )

  local = { pretty:true
    , page:pathname
    , nav:{left:env.pages.regular,right:env.pages.special}
    , user: user.name
    , admin:user.admin
     }

db.collection( pathname ).find().toArray(function(err,docs) {

    local.docs = docs

    jade.renderFile(env.dir.views + pathname + '.jade', local, function(err,html) {
      if(err)
        missingLayout(res, pathname, err)
      else
        res.end(html)
    }) 
})


}

function std_content(res, pathto, file, mime) {
  if( file.lastIndexOf('/') >= 0 )
    file = file.substring( file.lastIndexOf('/') )

  console.log( '* ' + file )
  fs.readFile(("" + pathto + file), function(err, data) {
    if (err) return err404( res, err )
    res.writeHead(200, {'content-type':mime})
    res.end(data)
  })
}


// * on error *
function missingLayout(res, name, err) {
  console.log( err )
  jade.renderFile(env.dir.views + env.pages.error + '.jade',{prett:true, page:name }, function(err, html) {
    res.end(html)
  })
}
// * on error *
function err404(res, err) {
  console.log( err )
  res.writeHead(404, {"Content-Type": "text/plain"});
  res.write("404 Not found.");
  res.end();
}

exports.home_page = home_page
exports.std_page = std_page
exports.std_content = std_content
exports.error = err404

exports.assetPath = assets
exports.mimeType = mimeType
exports.pagePath = pages
exports.specialCase = special