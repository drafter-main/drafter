$(document).ready(function(){
  if ($('.profile').length) new Profile.Settings();
  if ($('#profile_comments').length) new Profile.Comments();
});

var Profile = {}

Profile.Settings = function() {

  $('#left_nav a').click(function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).tab('show')
  });

  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#avatar_preview').attr('src', e.target.result);
      }
      reader.readAsDataURL(input.files[0]); 
    }
  }

  $(document).on("change", "#avatar", function(){
    readURL(this);
  });

};

Profile.Comments = function() {
  var numbers = 2;

  $(document).on("click", ".profile-comment-show-parent", function(){
    var $comment = $(this).parents('.profile-user-comment'),
        code = $comment.attr("data-code"),
        self = $(this);
    $.ajax({
      type: 'GET',
      url: "/comments/parent_comment/" + code,
      success: function(response) {
        if (response && response.success) {
          add_parent_comment($comment, response);
          self.hide();
        }
      }
    });
  });

  $(document).on("click", ".profile-comment-show-tree", function(){
    var $comment = $(this).parents('.profile-user-comment'),
        code = $comment.attr("data-code"),
        self = $(this);
    $.ajax({
      type: 'GET',
      url: "/comments/comment_tree/" + code,
      success: function(response) {
        if (response && response.success) {
          add_comment_tree($comment, response);
          self.hide();
        }
      }
    });
  });

  $(document).on("click", ".profile-comment-answer", function() {
    var $form = $("#form_1").clone(),
        $block = $(this).parents('.profile-user-comment');
    if ($block.find("form").length) return;
    $form.attr("id", "form_" + numbers);
    $block.append($form);
    $form.find("#parent_comment").val($block.attr("data-code"));
    $form.find("#post_id").val($block.attr("data-post"));
    $form.removeClass('hidden');
    numbers++;
  });

  $(document).on("click", ".send_comment", function(){
    var $form = $(this).parents("form"),
        $attachment = $form.find(".from-comment-attachment"),
        data = {};
    if (!$form.find("#com_body").val().length) return //need to refactor
    data = {
      com_body: $form.find("#com_body").val(),
      post_id: $form.find("#post_id").val(),
      parent_comment: $form.find("#parent_comment").val()
    };
    if ($attachment.attr("data-img").length) data.comment_img = $attachment.attr("data-img");
    button_loading.start($(this));
    $.ajax({
      type: "post",
      url: '/comments',
      data: {comment: data},
      error: function(response) {
        button_loading.stop($(this));
        $form.remove();
      },
      success: function(response) {
        button_loading.stop($(this));
        if (response && response.success) {
          $form.remove();
        } else $form.remove();
      }
    });

  });
  
  function build_comment_block(new_block, comment, response) {
    var v_up = true,
        v_down = true;
    new_block += response.rating + " оплесків ";
    new_block += "додано користувачем " + "<a class='profile-comment-owner' href='" + response.user.path + "'>@" + response.user.nick + "</a>";
    new_block += "<div class='profile-comment-body'>";
    new_block += "<div class='profile-comment-text'>"
    new_block += response.comment.body;
    if (response.comment.image) "<img class='comment-body-img' src='" + response.comment.image + "' width='300'/>";
    new_block += "</div>" 
    new_block += "</div>"
    new_block += "<div class='profile-comment-actions'>"
    new_block += "<a class='profile-comment-answer' href='javascript:void(0);'>Відповісти</a>";
    if (!response.vouted.same_user) {
      if (response.vouted.status == true) {
        v_up = false;
        v_down = true;
      } else if (response.vouted.status == false) {
        v_up = true;
        v_down = false;
      } else {
        v_up = true;
        v_down = true;
      }
      new_block += "<div class='glyphicon glyphicon-thumbs-up plus-comment' data-active='" + v_up + "' data=" + response.code + "></div>",
      new_block += "<div class='glyphicon glyphicon-thumbs-down minus-comment' data-active='" + v_down + "' data=" + response.code + "></div>";
    }
    new_block += "</div>";
    new_block += "</div>";
    return new_block;
  }

  function add_parent_comment(comment, response) {
    var new_block = "<div class='profile-user-comment added-parent' data-code='" + response.code + "' data-post='" + response.post + "'>",
        block = build_comment_block(new_block, comment, response);
    comment.addClass("profile-under-parent");
    $(block).insertBefore(comment);
  }

  function add_comment_tree(comment, response) {
    var new_block = "",
        block = "";
    $.each(response.comments, function(index, value) {
      new_block = "<div class='profile-user-comment profile-under-parent' data-code='" + value.code + "' data-post='" + value.post + "' >";
      block = build_comment_block(new_block, comment, value);
      comment.append($(block));
    });
  }

  $(document).on("click", ".plus-comment", function(){
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
          }
        }
      });
    } else neutral_vote(self);
  });

  $(document).on("click", ".minus-comment", function(){
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
          }
        }
      });
    } else neutral_vote(self);
  });

  function change_rating(self) {
    var rating_div = self.parents('.profile-user-comment').find('.profile-rating-comment'),
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
    code = el.attr('data');
    $.ajax({
      type: 'Put',
      data: {code: code},
      url: "/comments/neutral_vote",
      success: function(response) {
        if (response && response.success) {
          update_class_neutral_vote(el);
        }
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