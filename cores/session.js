var qs  = require('querystring')

function sessionZone( name, defs, local ) {
  this.peers = {}
  this.crons = {}
  this.ttl   = 2400000 // = 40 minutes
  this.id_len= 64
  this.interaction = {}


  this.start = function( user, token, ip ) {
    this.peers[ token ] = new userSession( user, token, ip, this.ttl )
    return this.peers[ token ]
  }

  this.transact = function(req, ip, token, hook, forms, cb ) {
    var ntok = salt(this.id_len)
    console.log("  --transact")
    if( this.existOrMake(token, ntok, ip) ) {
      /*reset both if connection from another IP happens*/
/*      if(this.peers[token].ip != ip ) {
        delete this.peers[token]
        delete this.crons[token]
        this.existOrMake(token, ip)
      }*/

      var swap = this.peers[token]
      delete this.peers[token]
      delete this.crons[token]


      swap.id = ntok

      this.peers[ntok] = swap
      this.updateCron(ntok, this.ttl)
    }

    token = ntok

    if( req.method == 'POST' ) {
      /*console.log('            --POST ' + hook )*/
      var query = ''
      var self = this

      req.on('data', function( parts ){
        query += parts
        if( query.length > 0xf4240 ) req.connection.destroy() // unstable payload
      })

      req.on('end', function() {
        //get a parsed and tested object back
        query = forms.parse(  hook, qs.parse(query) )

        if( query ) 
          self.interact( req, token, hook, query, cb )
        else 
          cb( self.peers[token], 'unrecognized request' )
        
      })

    } else
      cb( this.peers[token], false )

  }// end transaction

  this.interact = function( req, token, hook, query, cb ) {
    console.log( hook + query )
    if( typeof this.interaction[hook] === 'function' ) {
      var self = this
      this.interaction[hook](query, this.peers[token] , function( peer, err ){
        console.log('completeing interaction')
        self.peers[token] = peer
        cb( peer, err )
      })
    }
  }

  this.extract = function( req ) {
    var c = req.headers.cookie
    return (typeof c === "string") ? c.substr( c.indexOf(local.cookieName)+local.cookieName.length+1, this.id_len ) : false
  }

  this.end = function( user, token ) {

  }

  this.addInteraction = function( hook, func ) {
    if(typeof func === 'function')
      this.interaction[hook] = func
  }


  this.updateCron = function( token, ttl ) {
    this.crons[ token ] = setTimeout(function(){
      if( this.peers != undefined )
      delete this.peers[ token ]
    }, ttl)
  }

  this.existOrMake = function( token, ntok, ip ) {
    if( this.peers[token] != undefined )
      return true

    this.peers[ ntok ] = this.start(salt(this.id_len), ntok, ip)

    return false
  }

}

var SALTpossible = 'OO00AABBBCCCCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' 
function salt(i) {
    var s = ''
    while(i--)
        s += SALTpossible.charAt(Math.floor(Math.random() * SALTpossible.length));
    return s
}

function userSession(n_user, n_key, n_ip, n_ttl) {
  this.name = n_user
  this.id   = n_key
  this.ip   = n_ip
  this.ttl  = n_ttl
  this.user = false
  this.view = false
}

exports.sessionZone = sessionZone