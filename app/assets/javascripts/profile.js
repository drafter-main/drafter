$(document).ready(function(){
  if ($('#profile_settings').length) new Profile.Settings();
  if ($('#profile_comments').length) new Profile.Comments();
});

var Profile = {}

Profile.Settings = function() {
  var $ImageCut = $("#image-cut"),
      $selector = $ImageCut.find(".image-selector"),
      start_x = 0,
      start_y = 0,
      mouse_def_x = 0,
      mouse_def_y = 0,
      resing = false;
      new_avatar = document.getElementById("image-cut-foto");

  $('#left_nav a').click(function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).tab('show')
  });

  function prepare_image_cut_modal(img_width, img_height) {
    var $image_element = $ImageCut.find("#image-cut-foto"),
        $image_block = $image_element.parent(),
        image_block_width = (img_width > 568 ? 568 : img_width),
        size_value = (img_width > 568 ? img_width / image_block_width : 1),
        area = (img_width > 568 ? 284 : img_width / 2);

    start_x = 0;
    start_y = 0;
    mouse_def_x = 0;
    mouse_def_y = 0;

    $selector.css("left", "auto");
    $selector.css("top", 0 + "px");
    $selector.attr("data-x", "0");
    $selector.attr("data-y", "0");
    $("#image_square").val("");

    $image_block.css("width", image_block_width + "px");
    $image_block.css("height", parseInt(img_height / size_value) + "px");
    $image_block.attr("data-conf", size_value);  
  }

  $selector.draggable({ 
    containment: ".image-cut-panel",
    cancel : '.image-selector-resize',
    drag: function(){
            var scroll_x = $ImageCut.scrollLeft(),
                scroll_y = $ImageCut.scrollTop(),
                offset = $(this).offset(),
                xPos = offset.left,
                yPos = offset.top;

            if (start_x == 0 && start_y == 0) {
              start_x = xPos;
              start_y = yPos + scroll_y;
            } else {
              $(this).attr("data-x", xPos - start_x);
              $(this).attr("data-y", (yPos + scroll_y) - start_y);
            }
          } 
  });

  $(".image-cut-panel").mousemove(function( event ) {
    if (resing) {
      var s_width = parseInt($selector.css("width")),
          s_height = parseInt($selector.css("height"));

      if (mouse_def_x != 0 && event.pageX > mouse_def_x) {
        s_width += event.pageX - mouse_def_x; 
        s_height += event.pageX - mouse_def_x; 
      } else if (mouse_def_x != 0 && event.pageX < mouse_def_x) {
         s_width -= mouse_def_x - event.pageX;
         s_height -= mouse_def_x - event.pageX;
      }
      
      $selector.css("width", s_width + "px")
      $selector.css("height", s_height + "px");
      mouse_def_x = event.pageX;
      mouse_def_y = event.pageY;   
    }
  });

  $(".image-selector-resize").mousedown(function() {
    resing = true;
    mouse_def_x = 0;
    mouse_def_y = 0;
  });

  $(document).mouseup(function() {
    resing = false;
  });

  new_avatar.onload = function(){ prepare_image_cut_modal(this.width, this.height); }

  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#avatar_preview').attr('src', e.target.result);
        $("#image-cut-foto").attr('src', e.target.result);
        $(".btn-file").find("span").text("Зображення");
        $ImageCut.modal("show");
      }
      reader.readAsDataURL(input.files[0]); 
    }
  }

  $(document).on("change", "#avatar", function(){
    readURL(this);
  });

  $(document).on("click", "#image-cut-submit", function(){
    var square = [],
        conf = parseFloat($(".image-cut-panel").attr("data-conf")).toFixed(1);
    square.push(parseInt($selector.attr("data-x")) * conf);
    square.push(parseInt($selector.attr("data-y")) * conf);
    square.push(parseInt($selector.css("width")) * conf);
    square.push(parseInt($selector.css("height")) * conf);
    $("#image_square").val(square.join()); 
    $ImageCut.modal("hide");
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
    $form.find(".comment-parent-comment").val($block.attr("data-code"));
    $form.find(".comment-current-post").val($block.attr("data-post"));
    $form.removeClass('hidden');
    numbers++;
  });

  $(document).on("click", ".send_comment", function(){
    var $form = $(this).parents("form"),
        $attachment = $form.find(".from-comment-attachment"),
        data = {};
    if (!$form.find(".comment-com-body").val().length) return //need to refactor
    data = {
      com_body: $form.find(".comment-com-body").val(),
      post_comment: $form.find(".comment-current-post").val(),
      parent_comment: $form.find(".comment-parent-comment").val()
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