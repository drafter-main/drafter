$(document).ready(function(){
  if($('#menu_main').length) new Menu.Main();
});

var Menu = {};

Menu.Main = function() {
  var UserActionsModal = $("#user_actions_modal");
  $("#user_actions").click(function(){
    UserActionsModal.modal('show');
  });
}