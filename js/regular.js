var objCount = 0
var socket = io.connect() 

$(document).ready(function(){
	$('.generate-body').hide()
	$('.tab-over').hide()
	dropper()

	$('.admin-panel a.btn.btn-admin').click(function(){
		var page = $(this).attr('id')
		$(this).addClass('btn-active').siblings().removeClass('btn-active')
	})
	$('.hook,.shoot').click(function(){
		$('.generate-body').slideToggle()
	})
	$('.btn-login').click(function(){
		login()
	})
	$('input#acct, #pass:password').keydown(function(event) {
		if(event.keyCode == 13) login()
	})
	$('.tab').click(function(){
		$(this).siblings('.tab-over').animate({width:'toggle'},1000);
	})
	$('.delete').click(function(){
		socket.emit('delete',{id:$(this).attr('id'),page:$(this).attr('page')})
		$(this).parent().parent().fadeOut();
	})
	$("form#logout").submit(function (e) {
		e.preventDefault()
		socket.emit('logout', {user:$('#user').val(),token:$('#token').val()})
		setTimeout(function(){
			window.location.reload(1);
		}, 100)

	})
	// because Jquery on() and bind() werent giving me the correct event
	try{
		var drop = document.getElementById("dropper") 
		drop.addEventListener("dragstart", preventDefault, false);
		drop.addEventListener("dragenter", preventDefault, false);
		drop.addEventListener("dragleave", preventDefault, false);
		drop.addEventListener("drag", preventDefault, false);
		drop.addEventListener("dragend", preventDefault, false);
		drop.addEventListener("dragover", preventDefault, false);
		drop.addEventListener("drop", preventDefault, false);
	} catch(e) {}   
	function preventDefault(event) {
	    event.preventDefault()
	    event.stopPropagation()
	}
	$('.dropper').on('drop', function(event){
		if(event.originalEvent.dataTransfer){
			if(event.originalEvent.dataTransfer.files.length) {
				event.preventDefault()
				event.stopPropagation()
	            
	            var img = event.originalEvent.dataTransfer.files[0]
				var reader = new FileReader()
				reader.readAsDataURL(img);
				reader.onloadend=function(){
					$('.dropper').html( "<img class=\"img-responsive dropped center\" src=\"" + reader.result + "\">" )
					$('#uriImage').val( reader.result )
					$('.uri').text( reader.result )

			        /*var image = document.createElement('img');
			        image.src = reader.result;
			        image.onload = function() {
				        var canvas = document.createElement('canvas');
				        var ctx = canvas.getContext('2d');
				        ctx.drawImage(image, 0, 0, 300, 300);
				        canvas.onload = function(){
				        	var shrinked = canvas.toDataUrl('image/jpeg');
				        	alert( shrinked )	
				        }
			        }*/			
				}
			}
	    }
	})

	socket.on('login',function(bake) {
		document.cookie = bake
		setTimeout(function(){
				window.location.reload(1);
		}, 10);
	})

})

function dropper() {
	var drop = $('.dropper')
	if( !window.FileReader )
		return drop.text("Use a better browser!")
}

function login(){
	var acct = $('input#acct').val()
	var pass = $('#pass:password').val()
	socket.emit('login',{acct:acct,pass:pass})
}

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