$(document).ready(function(){
	var blurTarget = $('section.content, footer, .navbar.navbar-default')
	$('a').filter(function(){
		return $(this).attr('data-toggle') == "modal"
	}).click(function(){
		blurTarget.addClass('blur')
	})

	$('.exit').click(function(){
		blurTarget.removeClass('blur')
		$('.modal').removeClass('show')
	})
	/*registration validation*/
	$('#btn-register').click(function(){
		var f = {}, flags = [];
		$("#registerModel input").each(function(){
			var id = $(this).filter(':input').attr('id');
			$(this).closest('.form-group').removeClass('has-error');
		    f[ id ] = $(this).filter(':input').val();
		    if( id == 'Email' && !f[id].emailTest() ) {
				flags.push( id );
				$(this).closest('.form-group').addClass('has-error');
		    }
		    else if( f[id].length < 3 ) {
		    	$(this).closest('.form-group').addClass('has-error');
		    	flags.push( id );
		    }
		});
	    if( flags.length > 0 ) {
	    	$('#alertTarget1').html(''+
	    		'<div class="alert alert-dismissable alert-warning">' +
	    			'<button type="button" data-dismiss="alert" class="close" >'+
	    				'<span class=" glyphicon glyphicon-remove"></span>'+
	    			'</button>'+
	    			'<h4 class="left"> Warning! </h4>'+
	    			'<p class="left">' + flags + '</p>' +
	    		'</div>')
	    	$('#warnTarget').html("["+ flags +"]")
	    } else 
			$('form.modal#registerModel').submit();
	});/*end registration validation*/
	$("#btn-login").click(function(){ console.log("login"); $(this).closest("form").submit(); });
})

String.prototype.emailTest = function() {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(this);
}; 