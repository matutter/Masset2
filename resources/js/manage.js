$(document).ready(function(){
  var converter = new Showdown.converter();
  $('.label-out a').click(function(){
    $(this).addClass('active').siblings().removeClass('active')

    var id  = $(this).attr('id')
      , action = {
        half: function(cb){
          $('#editor, #previewer').addClass('col-sm-6')
          cb('#editor, #previewer')
        },
        edit: function(cb) {
          $('#previewer').addClass('hidden')
          $('#editor').addClass('col-sm-12')
          cb('#editor')
        },
        preview: function(cb) {
          $('#editor').addClass('hidden')
          $('#previewer').addClass('col-sm-12')
          cb('#previewer')
        }
    };
    $('#New').children().filter('div[class!=label-out]').stop().fadeOut("fast",function(){
      $('#editor, #previewer').removeClass('hidden col-sm-12 col-sm-6')
      action[id](function(self){
        $(self).fadeIn()
      });     
    })
  })

  $('#Title, #Header, #Body, #Footer').on('keyup',function(){

    var cursor = $(this).prop("selectionStart");
    console.log( cursor )
    $('.cursor').removeClass('cursor')
    var id = $(this).attr('id')

    var text = $(this).val().split()

    console.log( text )


    $('#'+id+'Target').html( converter.makeHtml( text.join() ) )


    $('#'+id+'Target').text()

  }) /*end keypress event*/

  $('#postTarget').height($('#editor .panel-body').height()+"px")


})