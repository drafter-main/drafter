keyboardControl = function(){
  $(document).keyup(function (evt) {
    evt.preventDefault();
    cur_pos = $(window).scrollTop();
    arr = [];
    switch(evt.keyCode) {
      // 'w' rating +
      case 87:
        break;

      // 's' rating -
      case 83:
        break;

      // 'a' left prev post
      case 65:
        $('.post').each(function (i, p) {
          p_top = $(p).offset().top;
          arr[i] = p_top;
          if (cur_pos <= p_top) {
            window.scrollTo(0, arr[i-1]);
            return false;
          }
        });
        break;

      // 'd' next post
      case 68:
        $('.post').each(function (i, p) {
          p_top = $(p).offset().top;
          if (cur_pos < p_top) {
            window.scrollTo(0, p_top);
            return false;
          }
        });
        break;

      // 'f' hide seen stories
      case 70:
        break;
    }
  });
}

init_key_con = new keyboardControl;