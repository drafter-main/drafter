$(document).on('ready page:load', function() {
  if($('#comments').length) new Comments.Comment();
});

var Comments = {};

Comments.Comment = function() {
  var $LoginModal = $("#user_actions_modal"),
      comment_form_count = 2;

  function show_login_modal_if_error() {
    if ($LoginModal.length) {
      $LoginModal.find(".modal-title").html("Щоб виконати дію, потрібно увійти");
      $LoginModal.modal("show");
    }
  }

  $(document).on('click', '.send_comment', function(e){
    e.preventDefault();
    send_comment($(this).parents('form'), $(this), check_reply($(this)));
  });

  $(document).on('click', '.comment_reply', function(){
    add_comment_form($(this).parents(".comment_item"));
  });

  $(document).on("click", ".add-comment-image", function(){
    var $ImgModal = $("#add-from-url-modal");
    $ImgModal.find("#add-image-url").attr("data-selected", $(this).parents("form").attr("id"));
    $ImgModal.modal("show");
  });

  $(document).on("click", "#image-url-field-submit", function(){
    var form_id = $(this).parents(".modal-body").find("#add-image-url").data("selected"),
        $attachment = $("#" + form_id).find(".from-comment-attachment");
    $attachment.attr("data-img", $("#image-url-field").val());
    $attachment.find("span").html("<a class='comment-img-url' href='javascript:void(0)'>Зображення</a>");
    $attachment.find("i").removeClass("hidden");
    $("#add-from-url-modal").modal("hide");
  });

  $(document).on("click", ".dismiss-comment-attachment", function(){
    var $attachment = $(this).parents(".from-comment-attachment");
    $attachment.attr("data-img", "");
    $attachment.find("span").html("Нічого не прикріплено");
    $(this).addClass("hidden");
  });

  function send_comment(form, button, reply) {
    if ($("#active_user").length && $("#active_user").val() == "false") {
      show_login_modal_if_error();
      return false;
    }
    var $attachment = form.find(".from-comment-attachment"),
        receiver = form.find(".receiver_comment").val(),
        data = {
          com_body: form.find("#com_body").val(),
          post_id: form.find("#post_id").val(),
          parent_comment: form.find("#parent_comment").val()
        };
    if (!reply && receiver.length) data.receiver = receiver.substring(1,substr.length-1);
    if ($attachment.attr("data-img").length) data.comment_img = $attachment.attr("data-img");

    button_loading.start(button);
    $.ajax({
      type: "post",
      url: '/comments',
      data: {comment: data},
      error: function(response) {
        button_loading.stop(button);
        if (reply) delete_reply_form(reply);
      },
      success: function(response) {
        button_loading.stop(button);
        if (response && response.success) {
          if (reply) replace_form_to_block(reply, response, data);
          else add_first_level_block(response, data);
        } else {
          if (reply) delete_reply_form(reply);
          show_login_modal_if_error();
        }
      }
    });
  }

  function add_comment_form(item) {
    if (item.find("form").length) return;
    var form = $("#add_new_comment").find("form").clone();
    form.attr("id", "form_" + comment_form_count);
    comment_form_count++;
    form.find("#com_body").val("");
    form.find("#parent_comment").val(item.attr('data-comment'));
    form.find(".receiver_comment").val(item.find(".comment_owner a").html());
    form.addClass("col-xs-offset-1");
    item.append(form);
  }

  function check_reply(element){
    var item = element.parents(".comment_item");
    if (item.length) return item;
    else return false;
  }

  function update_comments_count() {
    var $amount_comments = $(".post .amount_comments strong"),
        size = parseInt($amount_comments.html()) +1,
        last = String(size);
        title = "";
    last = last.substr(last.length-1, 1);
    if ( last == "1" && size != 11 ) title = "коментар";
    else if (size > 1 && size < 5) title = "коментарі";
    else title = "коментарів";
    $amount_comments.html(size + " " + title);
  }

  function build_block(response, data) {
    var block = $("#add_new_comment").find(".comment_item").clone();
    block.attr('data-comment', response.code);
    block.find(".comment_owner").html("<a href='" + response.user_path + "'>" + response.nick + "</a>");
    if (response.receiver) {
      block.find(".comment-content-text").html("<a href='" + response.receiver.path + "'>" + response.receiver.nick + "</a> " + data.com_body);
    } else {
      block.find(".comment-content-text").html(data.com_body);
    }
    if (response.img) block.find(".comment_content").append("<img class='comment-body-img' src='" + response.img + "' width='300'/>");
    block.find(".comment-avatar").attr("src", response.avatar);
    update_comments_count();
    block.show();
    return block;
  }

  function replace_form_to_block(item, response, data) {
    delete_reply_form(item);
    var block = build_block(response, data);
    if (!item.next().hasClass("replies")) $("<div class='replies'></div>").insertAfter(item);
    item.next().prepend(block);
  }

  function add_first_level_block(response, data) {
    var block = build_block(response, data);
    $("#comments_tree").prepend(block);
  }

  function delete_reply_form(item) {
    item.find('form').remove();
  }


    $(document).on("click", ".plus-comment", function(){
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
            url: "/comments/up_vote",
            success: function(response) {
              if (response && response.success) {
                change_rating(self);
                update_class_up_vote(self);
              } else show_login_modal_if_error();
            }
          });
        } else neutral_vote(self);
    });

    $(document).on("click", ".minus-comment", function(){
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
            url: "/comments/down_vote",
            success: function(response) {
              if (response && response.success) {
                change_rating(self);
                update_class_down_vote(self);
              } else show_login_modal_if_error();
            }
          });
        } else neutral_vote(self);
    });

    function change_rating(self) {
        var rating_div = self.closest('.comment_item').find('.rating_comment'),
            rating_val = parseInt(rating_div.html());
        if (self.hasClass('glyphicon-thumbs-up')){
            if (self.next().attr('data-active') == 'false') rating_val += 2;
            else if (self.attr('data-active') == 'true') rating_val += 1;
            else rating_val -= 1;
        } else {
            if (self.prev().attr('data-active') == 'false') rating_val -= 2;
            else if (self.attr('data-active') == 'true') rating_val -= 1;
            else rating_val += 1;
        }
        rating_div.html(rating_val == 1 ? rating_val + " оплеск" : rating_val + " оплесків");
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
        url: "/comments/neutral_vote",
        success: function(response) {
          if (response && response.success) {
            update_class_neutral_vote(el);
          } else show_login_modal_if_error();
        }
      });
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
