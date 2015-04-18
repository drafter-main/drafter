$(document).on('ready page:load', function() {
  if($('#comments').length) new Comments.Comment();
});

var Comments = {};

Comments.Comment = function() {

  $(document).on('click', '.send_comment', function(e){
    e.preventDefault();
    send_comment($(this).parents('form'), $(this), check_reply($(this)));
  });

  $(document).on('click', '.comment_reply', function(){
    add_comment_form($(this).parents(".comment_item"));
  });

  function send_comment(form, button, reply) {
    var data = {
      com_body: form.find("#com_body").val(),
      post_id: form.find("#post_id").val(),
      parent_comment: form.find("#parent_comment").val()
    }
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
        } else if (reply) delete_reply_form(reply);
      }
    });
  }

  function add_comment_form(item) {
    if (item.find("form").length) return;
    var form = $("#add_new_comment").find("form").clone();
    form.find("#com_body").val("");
    form.find("#parent_comment").val(item.attr('data-comment'));
    item.append(form);
  }

  function check_reply(element){
    var item = element.parents(".comment_item");
    if (item.length) return item;
    else return false;
  }

  function build_block(response, data) {
    var block = $("#add_new_comment").find(".comment_item").clone();
    block.attr('data-comment', response.code);
    block.find(".comment_owner").html(response.nick);
    block.find(".comment_content").html(data.com_body);
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


    $('.plus-comment').on('click', function(){
        self = $(this);
        change_rating(self);
        if (self.attr('data-active') == 'true'){
            update_class_up_vote(self);
            code = self.attr('data');
            $.ajax({
                type: 'Put',
                data: {code: code},
                url: "/comments/up_vote"
            });
        } else neutral_vote(self);
    });

    $('.minus-comment').on('click', function(){
        self = $(this);
        change_rating(self);
        if (self.attr('data-active') == 'true') {
            update_class_down_vote(self);
            code = self.attr('data');
            $.ajax({
                type: 'Put',
                data: {code: code},
                url: "/comments/down_vote"
            })
        } else neutral_vote(self);
    });

    function change_rating(self) {
        var rating_div = self.closest('.comment_item').find('.rating_comment'),
            rating_val = parseInt(rating_div.html());
        if (self.hasClass('glyphicon-thumbs-up')){
            if (self.next().attr('data-active') == 'false') rating_div.html(rating_val + 2);
            else if (self.attr('data-active') == 'true') rating_div.html(rating_val + 1);
            else rating_div.html(rating_val + -1);
        } else {
            if (self.prev().attr('data-active') == 'false') rating_div.html(rating_val - 2);
            else if (self.attr('data-active') == 'true') rating_div.html(rating_val - 1);
            else rating_div.html(rating_val + 1);
        }
    }

    function neutral_vote(el) {
        update_class_neutral_vote(el);
        code = el.attr('data');
        $.ajax({
            type: 'Put',
            data: {code: code},
            url: "/comments/neutral_vote"
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
