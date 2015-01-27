ButtonLoading = function(){
  var loading = "<span class='glyphicon glyphicon-refresh spinning'></span> "
  var def_value = "";

  this.start = function(button) {
    def_value = button.html();
    button.html(loading + def_value);
  }
  this.stop = function(button) {
    button.html(def_value);
    def_value = "";
  }
};

button_loading = new ButtonLoading;