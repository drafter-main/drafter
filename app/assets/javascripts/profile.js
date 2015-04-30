$(document).ready(function(){
  if ($('.profile').length) new Profile.Settings();
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