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
}