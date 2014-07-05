$(document).ready(function(){
	$('.sign-up, .sign-up-btn').hide();

	$('.select-one').click(function(){
		if( $(this).hasClass('active') ) return;
		$('.sign-up, .sign-in, .sign-up-btn, .sign-in-btn').stop().toggle('swing');
		$('.select-one').removeClass('active');
		$(this).addClass('active');
	})

	/* send account request */
	$('.sign-up-btn').click(function(){
		$('form').attr('action', '/signup' )
		var f = {};
		var flags = [];
		$("form.account-form input").each(function(){
			var id = $(this).filter(':input').attr('id');
			$(this).css({borderColor:"#ccc"});
		    f[ id ] = $(this).filter(':input').val();
		    if( id == 'Email' ){
		    	if( !f[id].emailTest() ) {
		    		flags.push( id );
		    		$(this).css({borderColor:"red"});
		    	}
		    }
		    else if( f[id].length < 6 && id != "Website" ) {
		    	$(this).css({borderColor:"red"});
		    	flags.push( id );
		    }
		});

	    if( flags.length > 0 ) 
	    	$('.alert').html("Some fields were not complete. ["+ flags +"]").show();
	    else 
			$('form').submit();

	});// end front end sign up validation
	$('.sign-in-btn').click(function(){
		$('form').attr('action', '/login' )
		$('form').submit()
	});
});
String.prototype.emailTest = function() {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(this);
}; 