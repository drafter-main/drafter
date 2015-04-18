$(document).on('ready page:load', function () {
    new Posts()
});

Posts = function() {
  init_key_con;

  $('.plus').on('click', function(){
      self = $(this);
      change_rating(self);
      if (self.attr('data-active') == 'true'){
          update_class_up_vote(self);
          code = self.attr('data');
          $.ajax({
              type: 'Put',
              data: {code: code},
              url: "/posts/up_vote"
          });
      } else neutral_vote(self);
  });

  $('.minus').on('click', function(){
      self = $(this);
      change_rating(self);
      if (self.attr('data-active') == 'true') {
          update_class_down_vote(self);
          code = self.attr('data');
          $.ajax({
              type: 'Put',
              data: {code: code},
              url: "/posts/down_vote"
          })
      } else neutral_vote(self);
  });

  function change_rating(self) {
    var rating_div = self.closest('.post').find('.rating_post strong'),
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
          url: "/posts/neutral_vote"
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

