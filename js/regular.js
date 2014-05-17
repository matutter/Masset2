var objCount = 0
var socket = io.connect() 

$(document).ready(function(){
	$('.generate-body').hide()
	$('.admin-panel a.btn.btn-admin').click(function(){
		var page = $(this).attr('id')
		$(this).addClass('btn-active').siblings().removeClass('btn-active')
	})
	$('.hook,.shoot').click(function(){
		$('.generate-body').slideToggle()
	})
	$('.btn-login').click(function(){
		var acct = $('input#acct').val()
		var pass = $('#pass:password').val()
		socket.emit('login',{acct:acct,pass:pass})
	})
	socket.on('login',function(bake) {
		document.cookie = bake
		setTimeout(function(){
				window.location.reload(1);
		}, 10);
	})

})


function checkTextArea() {
	var obj = '#form-builder-target textarea'
	var text = $(obj).val().replace(/(\r\n|\n|\r)/gm,"")
	try {
		if(  $.parseJSON(text)  )
			$(obj).removeClass('json-fail')
	}
	catch(e) {
		console.log( e )
		$(obj).addClass('json-fail')
		return false
	}
	return true
}