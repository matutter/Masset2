function formParser(defs) {
  formList = {}

  this.parse = function( name, form  ) {
    /*console.log( '--form ' + name  )*/
    if( typeof formList[name] === 'object' ) {
      /*get arrays from DEF*/
      crit = formList[name].critical
      both = crit.concat( formList[name].optional )

      /*return false if form is missing any critical input*/
      for( var input in crit )
        if( !form.hasOwnProperty( crit[input] ) )
          return false

      /*delete empty optional input*/
      for( var input in form )
        if( both.indexOf( input ) < 0 )
          delete form[input]

      return form
    }
    else return false
  }

  /*call module.addParse('name',['important'],['optional'])*/
  this.addParser = function( name, crit, opt ) {
    formList[ name ] = new formDEF( crit, opt )
  }
}

function formDEF( critical, optional ) {
    this.critical = critical
    this.optional = optional
}

exports.formParser = formParser