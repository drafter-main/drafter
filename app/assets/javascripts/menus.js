$(document).ready(function(){
  if($('#menu_main').length) new Menu.Main();
});

var Menu = {};

Menu.Main = function() {
  var UserActionsModal = $("#user_actions_modal");
  $("#user_actions").click(function(){
  	UserActionsModal.find(".modal-title").html("Увійти в 4claps");
    UserActionsModal.modal('show');
  });

  $("#search_icon").click(function(){
    $("#search_icon").toggle();
    $("#search_form").toggle();
    $("#search").focus();
  });

  $("#search").focusout(function(){
    $("#search_icon").toggle();
    $("#search_form").toggle();
    $("#search").val('');
  });

  $("#search_submit").click(function(){
    $("#search_form").submit();
  });

};