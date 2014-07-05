// blog schema mostly from http://www.jarrodoberto.com/_blog-assets/design-pattern-blog-erd/images/erd.png
var local = {}
  , crypto = require('crypto')

function blog_category() {
  this.name     = '';
  this.shortName= '';
  this.hidden   = false;
  this.date     = new Date().toJSON();
};

function blog_post_to_catagory() {
  this.catagory_id = 0;
  this.post_id = 0;
};

function blog_author() {
  this.display_name = '';
  this.fname = '';
  this.lname = '';
};

function blog_post() {
  this.title = '';
  this.image = '';
  this.article = '';
  this.repoURL = '';
  this.author_id = 0;
  this.date = null;
  this.month = null;
  this.featured = false;
  this.hidden = false;
  this.hide_comments = false;
  this.views = 0;

  this.create = function() {
    var d = new Date();
    this.date = d.toJSON();
    this.month = d.getMonth();
  };
};

function blog_tag() {
  this.post_id = 0;
  this.tag = '';
};

function blog_related() {
  this.blog_post_id = 0
  this.blog_related_post_ids = []
}

function blog_comment() {
  this.post_id = 0;
  this.is_reply_to_id = 0;
  this.comment = '';
  this.hidden = false;
  this.date = new Date().toJSON();
};

function user() {
  this.name = ''
  this.title = ''
  this.email = ''
  this.websiteURL = ''
  this.hash = ''
  this.canPost = true
  this.canComment = true
  this.dateCreated = null
  this.color = {}

  this.create = function( Nname, Npass, Nmail, Nweb ) {
    this.name = Nname
    this.hash = passwordToHash( Npass )
    this.email = Nmail
    this.websiteURL = Nweb
    this.dateCreated = dateNow()
  }

}


function dateNow() {
  var date = new Date()
    , hour = (date.getHours() < 10 ? "0" : "") + date.getHours()
    , min  = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes()
    , year = date.getFullYear()
    , month= ( (date.getMonth() + 1) < 10 ? "0" : "") +  (date.getMonth() + 1)
    , day  = ( date.getDate() < 10 ? "0" : "") +  date.getDate()
    , now  = month+'/'+day+'/'+year+' '+hour+':'+min+(hour[0]=='0'?'PM':"AM")
  return now
}

/*unit test*/
function loginDEF(obj, cb) {
  var __LOGIN_DEF__ = {Username:'name', Password:'hash'}
  var cred = {}

  for( var type in __LOGIN_DEF__ ) {
    if( !obj.hasOwnProperty( type ) ) return false
    cred[__LOGIN_DEF__[type]] = obj[type]
  }
  cred.hash = passwordToHash( cred.hash )
  cb( cred )
}

function passwordToHash( pass ) {
  return crypto.createHash( 'sha512' ).update( pass, 'utf-8' ).digest( 'base64' )
}

// remove methods before DB insertion
user.prototype.removePropertyType = function( type ) {
  for( var prop in this ) 
    if(typeof this[prop] === type)
      delete this[prop]
};
user.prototype.valid = function() {
  return ( this.name.length > 3 && this.email.emailTest()  )
};
String.prototype.emailTest = function() {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(this);
}; 


function DBsetup( db, verbose ) {
  if(verbose) console.log( ' DB schema unit test ' )
  var collections = [ 'user', 'blog_comment', 'blog_related', 'blog_tag', 'blog_post', 'blog_author', 'blog_post_to_catagory', 'blog_category' ]
  var each = 0;

  db.collection( 'user' ).ensureIndex( { name: 1 }, { unique: true }, function(err, info) {
    if(verbose) console.log( collections[each++] + '  ' + info )
    if(err) console.log( collections[each++] + '  ' + err )
  })
  db.collection( 'blog_comment' ).ensureIndex( { is_reply_to_id: 1 }, function(err, info) {
    if(verbose) console.log( collections[each++] + '  ' + info )
    if(err) console.log( collections[each++] + '  ' + err )
  })
  db.collection( 'blog_related' ).ensureIndex( { blog_related_post_ids: 1 }, function(err, info) {
    if(verbose) console.log( collections[each++] + '  ' + info )
    if(err) console.log( collections[each++] + '  ' + err )
  })
  db.collection( 'blog_tag' ).ensureIndex( { tag: 1 }, function(err, info) {
    if(verbose) console.log( collections[each++] + '  ' + info )
    if(err) console.log( collections[each++] + '  ' + err )
  })
  db.collection( 'blog_post' ).ensureIndex( { month: 1 }, function(err, info) {
    if(verbose) console.log( collections[each++] + '  ' + info )
    if(err) console.log( collections[each++] + '  ' + err )
  })
  db.collection( 'blog_author' ).ensureIndex( { display_name: 1 }, function(err, info) {
    if(verbose) console.log( collections[each++] + '  ' + info )
    if(err) console.log( collections[each++] + '  ' + err )
  })
  db.collection( 'blog_post_to_catagory' ).ensureIndex( { catagory_id: 1 }, function(err, info) {
    if(verbose) console.log( collections[each++] + '  ' + info )
    if(err) console.log( collections[each++] + '  ' + err )
  })
  db.collection( 'blog_category' ).ensureIndex( { name: 1 }, { unique: true }, function(err, info) {
    if(verbose) console.log( collections[each++] + '  ' + info )
    if(err) console.log( collections[each++] + '  ' + err )
  })

}

// functional unit tests
exports.DBsetup = DBsetup
exports.loginDEF = loginDEF
exports.getNow = dateNow

// DB objects
exports.blog_category = blog_category
exports.blog_post_to_catagory = blog_post_to_catagory
exports.blog_author = blog_author
exports.blog_post = blog_post
exports.blog_tag = blog_tag
exports.blog_related = blog_related
exports.blog_comment = blog_comment
exports.user = user

// locals
exports.locals = local