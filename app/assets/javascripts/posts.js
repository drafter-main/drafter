$(document).on('ready page:load', function () {
    new Posts()
});

Posts = function() {
  init_key_con;
  var $LoginModal = $("#user_actions_modal");

  function show_login_modal_if_error() {
    if ($LoginModal.length) {
      $LoginModal.find(".modal-title").html("Щоб виконати дію, потрібно увійти");
      $LoginModal.modal("show");
    }
  }

  $('.plus_rating').on('click', function(){
      if ($("#active_user").length && $("#active_user").val() == "false") {
        show_login_modal_if_error();
        return false;
      } 
      self = $(this);
      if (self.attr('data-active') == 'true'){
        code = self.attr('data');
        $.ajax({
          type: 'Put',
          data: {code: code},
          url: "/posts/up_vote",
          success: function(response) {
            if (response && response.success) {
              change_rating(self);
              update_class_up_vote(self);
            } else show_login_modal_if_error();
          }
        });
      } else neutral_vote(self);
  });

  $('.minus_rating').on('click', function(){
      if ($("#active_user").length && $("#active_user").val() == "false") {
        show_login_modal_if_error();
        return false;
      } 
      self = $(this);
      if (self.attr('data-active') == 'true') {
        code = self.attr('data');
        $.ajax({
          type: 'Put',
          data: {code: code},
          url: "/posts/down_vote",
          success: function(response) {
            if (response && response.success) {
              change_rating(self);
              update_class_down_vote(self);
            } else show_login_modal_if_error();
          }
        })
      } else neutral_vote(self);
  });

  function change_rating(self) {
    var rating_div = self.closest('.post').find('.rating_post strong'),
        rating_val = parseInt(rating_div.text());
    if (self.hasClass('image_claps')){
        if (self.next().attr('data-active') == 'false') rating_div.text(rating_val + 2);
        else if (self.attr('data-active') == 'true') rating_div.text(rating_val + 1);
        else rating_div.html(rating_val + -1);
    } else {
        if (self.prev().attr('data-active') == 'false') rating_div.text(rating_val - 2);
        else if (self.attr('data-active') == 'true') rating_div.text(rating_val - 1);
        else rating_div.html(rating_val + 1);
    }
  }

  function neutral_vote(el) {
    if ($("#active_user").length && $("#active_user").val() == "false") {
      show_login_modal_if_error();
      return false;
    } 
    code = el.attr('data');
    $.ajax({
      type: 'Put',
      data: {code: code},
      url: "/posts/neutral_vote",
      success: function(response) {
        if (response && response.success) {
          update_class_neutral_vote(el);
          change_neutral_rating(el);
        } else show_login_modal_if_error();
      }
    });
  }

  function change_neutral_rating(self) {
    var rating_div = self.closest('.post').find('.rating_post strong'),
      rating_val = parseInt(rating_div.text());
    if (self.hasClass('image_claps')){
      rating_div.html(rating_val - 1);
    } else {
      rating_div.html(rating_val + 1);
    }
  }

  function update_class_neutral_vote(el) {
      el.attr('data-active', 'true');
  }

  function update_class_up_vote(el) {
      el.attr('data-active', 'false');
      el.next().attr('data-active', 'true');
  }

  function update_class_down_vote(el) {
      el.attr('data-active', 'false');
      el.prev().attr('data-active', 'true');
  }
};

