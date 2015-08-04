$(document).on('ready page:load', function() {
  if($('#post-builder').length) new PostBuilder();
});

var PostBuilder = function(){
  var builder_elements_count = 0,
      func_elements = "a.image-type-color, a.video-type-color, a.text-type-color, a.tools-type-color",
      self = this;
  
  new PostBuilder.ImageUploadFromPC(this);
  new PostBuilder.ImageUploadFromUrl(this);
  new PostBuilder.AddVideo(this);
  new PostBuilder.AddText(this);
  new PostBuilder.EditTitle(this);
  new PostBuilder.MoveItems(this);
  new PostBuilder.DeleteItems(this);
  new PostBuilder.Tags(this);
  new PostBuilder.CreatePost(this);

  this.post_title = "";
  this.post_description = "";
  this.post_content = "";
  this.post_type = "";

  this.add_new_object = function(type){ create_new_object(type) };
  this.modify_alert = function() { alert("aaaaaaa") };

  this.disable_actions = function(fields) {
    $(fields).addClass("disabled-elements");
  };

  this.enable_actions = function(fields) {
    $(fields).removeClass("disabled-elements");
  };

  function create_new_object(type) {
  	var $element = $("#clear-objects ." + type).clone(),
        $elements = false;
    builder_elements_count++;
    $element.attr("id", builder_elements_count);
    $("#builder-canvas").append($element);
    if ($("#builder-canvas").find(".dragble-object").length > 1) self.enable_actions("#move_element");
    if ($("#builder-canvas").find(".added-object").length > 0) self.enable_actions("#delete_element");
    if (["image-object", "video-object"].indexOf(type) != -1) $('#clear-objects .' + type + ':first-child').attr('src', "#");
    else if (type === "text-object") {
      var canva = $("#builder-canvas").find(".text-canvas:last");
      canva.attr("id", "canvas_" + builder_elements_count);
    }
  }

  $(document).on("mousedown", func_elements, function(){
    $(this).css("opacity", 0.7);
    $(this).mouseup(function(){
      $(this).css("opacity", 1);
    });
  });
};

PostBuilder.ImageUploadFromPC = function(PostBuilder) {
  var disable = "#video_net, #move_element_to_bottom, #move_element_to_top, #move_element, #move_stop, #text_edit, #text_add, #image_net, #image_pc";
  this.uploaded_from_pc = false;
  
  function readURL(input) {
    if (input.files && input.files[0]) {
      if (input.files[0].type == "image/gif" && $("#builder-canvas .added-object").length) return; // need to refactor
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#clear-objects .picture-element').attr('src', e.target.result);
        PostBuilder.add_new_object("image-object");
        PostBuilder.post_type = "image";
        if (input.files[0].type == "image/gif") PostBuilder.disable_actions(disable);
        else PostBuilder.disable_actions("#video_net");
      }
      reader.readAsDataURL(input.files[0]); 
    }
  }

  $(document).on("click", "#image_pc:not(.disabled-elements)", function(){
    $("#upload-from-pc").trigger("click");
  });

  $(document).on("change", "#upload-from-pc", function(){
    readURL(this);
  });
};

PostBuilder.ImageUploadFromUrl = function(PostBuilder) {
  var $AddFromUrlModal = $("#add-from-url-modal")
      $url_element = $AddFromUrlModal.find("#image-url-field"),
      disable = "#video_net, #move_element_to_bottom, #move_element_to_top, #move_element, #move_stop, #text_edit, #text_add, #image_net, #image_pc";

  $(document).on("click", "#image_net:not(.disabled-elements)", function(){
  	$url_element.val("");
    $AddFromUrlModal.modal("show");
  });

  $(document).on("click", "#image-url-field-submit", function(){
    if ($url_element.val() != "") {
      if ($url_element.val().match(/\.(gif)$/) != null && $("#builder-canvas .added-object").length) return;
      $('#clear-objects .picture-element').attr('src', $url_element.val());
      $AddFromUrlModal.modal("hide");
      PostBuilder.add_new_object("image-object");
      PostBuilder.post_type = "image";
      if ($url_element.val().match(/\.(gif)$/) != null) PostBuilder.disable_actions(disable);
      else PostBuilder.disable_actions("#video_net");
    }
  });
};

PostBuilder.EditTitle = function(PostBuilder) {
  var $EditTitleModal = $("#edit-title-modal");

  $(document).on("click", "#post-edit-title", "#post-edit-description",function(){
    $EditTitleModal.modal("show");
  });

  $EditTitleModal.on("click", "#edit-title-modal-submit" ,function(){
    var title = $EditTitleModal.find("#title").val(),
        description = $EditTitleModal.find("#description").val();
    $("#post-edit-title").find(".edit-title-desk-tl").html(title);
    $("#post-edit-description").find("h4").html(description);
    PostBuilder.post_title = title;
    PostBuilder.post_description = description;
    $EditTitleModal.modal("hide");
  });

};

PostBuilder.AddText = function(PostBuilder) {
  var $AddTextModal = $("#add-text-modal"),
      prepare_to_select = false,
      $selected = false;

  $('#add_text_color').colpick({
    flat:true,
    layout:'hex',
    onSubmit: function(hsb,hex,rgb){
      $("#add_text_color_selected").css("background-color", "#" + hex);
      $("#text_editor").css("color",  "#" + hex);
      $("#add_text_color").hide();
    }
  });

  $('#add_background_color').colpick({
    flat:true,
    layout:'hex',
    onSubmit: function(hsb,hex,rgb){
      $("#add_background_color_selected").css("background-color", "#" + hex);
      $("#text_editor").css("background-color",  "#" + hex);
      $("#add_background_color").hide();
    }
  });

  $('#add-text-modal').on('click', function(e) { 
    if( e.target == this ) {
      if ($selected) PostBuilder.enable_actions("#text_edit");
      prepare_to_select = false;
      $selected = false;
    }
  });

  $(document).on("click", "#add-text-modal .close",function() {
    if ($selected) PostBuilder.enable_actions("#text_edit");
    prepare_to_select = false;
    $selected = false;
  });

  $(document).on("mousedown", "#add_text_color_parent, #add_background_color_parent", function(){
    $(this).css("opacity", 0.7);
    $(this).mouseup(function(){
      $(this).css("opacity", 1);
    });
  });

  function set_text_add_properties(text_color, background, font_size) {
    $("#add_text_color_selected").css("background-color", text_color);
    $("#add_background_color_selected").css("background-color", background);
    $("#text_editor").css({
      "font-size" : font_size + "px",
      "color" : text_color,
      "background-color" : background
    })
    $("#text_font_size").val(font_size);
  }

  $(document).on("click", "#text_add",function() {
    set_text_add_properties("#555555", "#FFF", "14");
    $("#text_editor").val("");
    $AddTextModal.modal("show");
  });

  $(document).on("click", "#add_text_color_parent",function(){
    $("#add_background_color").hide();
    $("#add_text_color").show();
  });

  $(document).on("click", "#text_edit",function(){
    $("#builder-canvas .image-object").css("opacity", "0.3");
    PostBuilder.disable_actions("#text_edit");
    prepare_to_select = true;
  });

  $(document).on("click", "#builder-canvas .text-element",function(){
    if (prepare_to_select) {
      var parent = $(this).parent();
      $("#builder-canvas .image-object").css("opacity", "1");
      set_text_add_properties(parent.css("color"), parent.css("background-color"), parseInt(parent.css("font-size")));
      prepare_to_select = false;
      $selected = parent;
      $AddTextModal.modal("show");
    }
  });

  $(document).on("click", "#add_background_color_parent",function(){
    $("#add_text_color").hide();
    $("#add_background_color").show();
  });

  $(document).on("change", "#text_font_size",function(){
    $("#text_editor").css("font-size", $(this).val() + "px");
  });

  function prepare_text_to_draw(parent_element) {
    var lines = $("#text_editor").val().split("\n"),
        canvas_lines = [],
        canvas_formatted = "",
        formatted = "",
        result = {};

    parent_element.append("<span></span>");
    var $poligon = parent_element.find("span:first");

    $poligon.css({
      "font-size" : $("#text_editor").css("font-size"),
      "color" : "#FFF"
    });

    for (var i = 0; i < lines.length; i++) {
      $poligon.html(lines[i]);
      if ($poligon.width() > 563) {
        $poligon.html("");
        canvas_formatted = "";
        for (var j = 0; j < lines[i].length; j++) {
          $poligon.html($poligon.html() + lines[i][j]);
          if ($poligon.width() > 563) {
            $poligon.html("");
            formatted +=  "\n";
            canvas_lines.push(canvas_formatted);
            canvas_formatted = "";
          }
          formatted += lines[i][j];
          canvas_formatted += lines[i][j];
          if (j == lines[i].length -1) canvas_lines.push(canvas_formatted);
        }
      } else {
        formatted += lines[i];
        canvas_lines.push(lines[i]);
      }
      formatted += "\n";
    }

    $poligon.remove();
    result.formatted = formatted;
    result.canvas_lines = canvas_lines;
    return result;
  }

  function process_text_block(canvas_id, element, formatted_text) {
    var text_size = parseInt($("#text_editor").css("font-size"));
    var outer_height =  formatted_text.canvas_lines.length * (text_size * 1.5);

    var textCanvas = document.getElementById(canvas_id);
    textCanvas.height = outer_height;
    var ctx = textCanvas.getContext("2d");
    ctx.fillStyle = $("#text_editor").css("color");
    var re_size_go = text_size * 1.1;
    var re_size = re_size_go;

    ctx.font = text_size + "px 'Helvetica Neue', Helvetica, Arial, sans-serif";
    ctx.fillStyle = $("#text_editor").css("color");
    for(var i=0; i < formatted_text.canvas_lines.length; i++) {
      ctx.fillText(formatted_text.canvas_lines[i], 15, re_size_go);
      re_size_go += re_size;
    }

    var convasToImage = textCanvas.toDataURL();
    ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
    element.find(".text-canvas").hide();
    element.append("<img class='canvas-image text-element' src='" + convasToImage + "' >");
   
    element.css({
      "font-size" : $("#text_editor").css("font-size"),
      "color" : $("#text_editor").css("color"),
      "background-color" : $("#text_editor").css("background-color")
    });
    element.append("<div class='canvas_hidden' style='display:none;'>" + formatted_text.formatted + "</div>");
  }

  function add_new_text_block() {
    var $text_element = $('#clear-objects .text-object');

    PostBuilder.add_new_object("text-object");

    var $added_element = $("#builder-canvas").find(".text-object:last");
    var formatted_text = prepare_text_to_draw($added_element);

    process_text_block($added_element.find(".text-canvas:first").attr("id"), $added_element, formatted_text);

    PostBuilder.enable_actions("#text_edit");
    PostBuilder.disable_actions("#video_net");
    $AddTextModal.modal("hide");
  }

  function edit_existing_block() {
    var canva_id = $selected.find(".text-canvas").attr("id");
    $selected.html("");
    var formatted_text = prepare_text_to_draw($selected);
    $selected.append('<canvas id="' + canva_id +'" class="text-canvas text-element" width="600" height="'+parseInt($("#text_editor").prop('scrollHeight'))+'">');
    
    process_text_block(canva_id, $selected, formatted_text);
    
    $selected = false;
    $AddTextModal.modal("hide");
  }

  $(document).on("click", "#add-text-modal-submit",function(){
    if ($("#text_editor").val().length) {
      if ($selected) edit_existing_block();
      else add_new_text_block();
      PostBuilder.enable_actions("#text_edit");
      PostBuilder.post_type = "image";
    }
  });

};

PostBuilder.AddVideo = function(PostBuilder) {
  var $AddVideoModal = $("#add-video-modal"),
      $url_element = $AddVideoModal.find("#video-url-field"),
      $select_block = $AddVideoModal.find("#video-source"),
      $url_block = $AddVideoModal.find("#video-source-url"),
      type = "";

  $(document).on("click", "#video_net:not(.disabled-elements)",function(){
  	$select_block.show();
  	$url_block.hide();
  	$url_element.val("");
  	$AddVideoModal.find(".modal-header h4").html("Виберіть джерело відео");
    $AddVideoModal.modal("show");
  });

  function show_url_input() {
  	$select_block.hide();
  	$AddVideoModal.find(".modal-header h4").html("Вкажіть URL-адресу відео");
  	$url_block.show();
  }

  $(document).on("click", ".video-source-youtube-icon", function(){
    type = "youtube";
    show_url_input();
  });

  $(document).on("click",".video-source-coub-icon", function(){
    type = "coub";
    show_url_input();
  });

  function get_video_data() {
  	if (type == "youtube") return data_youtube();
  	else if (type == "coub") return data_coub();
  	else return false;
  }

  function data_youtube() {
    var parse_youtube = $url_element.val().match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/i);
    if (parse_youtube != null && parse_youtube[2].length) {
      return "http://www.youtube.com/embed/" + parse_youtube[2];
    } else return false;
  }

  function data_coub() {
    var parse_coub = $url_element.val().match(/^.*(\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/i);
    if (parse_coub != null && parse_coub[2].length) {
      return "http://coub.com/embed/" + parse_coub[2] + "?muted=false&autostart=false&originalSize=false&hideTopBar=false&startWithHD=false";
    } else return false;
  }

  $(document).on("click", "#video-url-field-submit", function(){
    var video = get_video_data(),
        disable = "#video_net, #move_element_to_bottom, #move_element_to_top, #move_element, #move_stop, #text_edit, #text_add, #image_net, #image_pc";
    if (video) {
      $('#clear-objects .video-element').attr('src', video);
	    $AddVideoModal.modal("hide");
	    PostBuilder.add_new_object("video-object");
      PostBuilder.disable_actions(disable);
      PostBuilder.post_type = "video";
    }
  });

};


PostBuilder.MoveItems = function(PostBuilder) {
  var self = this,
      prepare_to_select = false,
      $selector = false,
      $selected = false,
      moving = {
        top: -1,
        bottom: 1
      };

  this.top = function(cloned, neighboring) {
    if (neighboring.prev().hasClass("dragble-object")) PostBuilder.enable_actions("#move_element_to_top");
    else PostBuilder.disable_actions("#move_element_to_top");
    PostBuilder.enable_actions("#move_element_to_bottom");
    cloned.insertBefore(neighboring);
  }

  this.bottom = function(cloned, neighboring) {
    if (neighboring.next().hasClass("dragble-object")) PostBuilder.enable_actions("#move_element_to_bottom");
    else PostBuilder.disable_actions("#move_element_to_bottom");
    PostBuilder.enable_actions("#move_element_to_top");
    cloned.insertAfter(neighboring);
  }

  function process_moving(action) {
    var $cloned = $selected.clone(),
        $neighboring = moving[action] > 0 ? $selected.next() : $selected.prev();
    self[action]($cloned, $neighboring);
    $selected.remove();
    $selected = $cloned;
    move_selector(moving[action] * parseInt($neighboring.css("height")), false, false);
  }

  function move_selector(top, width, height) {
    var new_top = top + parseInt($selector.css("top"));
    $selector.css("top", new_top);
    if (width) $selector.css("width", width);
    if (height) $selector.css("height", height);
  }

  $(document).on("click", "#move_element:not(.disabled-elements)", function(){
    prepare_to_select = true;
    PostBuilder.disable_actions("#move_element, #delete_element");
    PostBuilder.enable_actions("#move_stop");
  });

  $(document).on("click", ".dragble-object", function(){
    var position = false;
    if (prepare_to_select) {
      $selector = $("#clear-objects .canvas-selector").clone();
      $selected = $(this);
      if ($selected.next().hasClass("dragble-object")) PostBuilder.enable_actions("#move_element_to_bottom");
      if ($selected.prev().hasClass("dragble-object")) PostBuilder.enable_actions("#move_element_to_top");
      $("#builder-canvas").prepend($selector);
      position = $selected.position();
      move_selector(position.top, $(this).css("width"), $(this).css("height"));
      $selector.show();
      prepare_to_select = false;
    }
  });

  $(document).on("click", "#move_element_to_bottom:not(.disabled-elements), #move_element_to_top:not(.disabled-elements)", function(){
    if (!$selected) return;
    process_moving($(this).attr("data-vector"));
  });

  $(document).on("click", "#move_stop:not(.disabled-elements)", function(){
    prepare_to_select = false;
    if ($selector) $selector.remove();
    $selector = false;
    $selected = false;
    PostBuilder.disable_actions("#move_stop, #move_element_to_top, #move_element_to_bottom");
    PostBuilder.enable_actions("#move_element, #delete_element");
  });
};

PostBuilder.DeleteItems = function(PostBuilder) {
  var prepare_to_delete = false;

  function process_element_delete(element) {
    var elements = $("#builder-canvas").find(".dragble-object").length - 1;
    element.remove();
    prepare_to_delete = false;
    if (elements < 1) {
      PostBuilder.disable_actions("#delete_element"); 
      PostBuilder.enable_actions("#image_pc, #image_net, #text_add, #video_net");
      PostBuilder.post_type = "";
    }
    else PostBuilder.enable_actions("#delete_element");
    if (elements < 2) PostBuilder.disable_actions("#move_stop, #move_element_to_top, #move_element_to_bottom, #move_element");
    if ($("#builder-canvas").find(".text-object").length < 1) PostBuilder.disable_actions("#text_edit");
  }

  $(document).on("click", "#delete_element:not(.disabled-elements)", function(){
    prepare_to_delete = true;
    PostBuilder.disable_actions("#delete_element");
  });

  $(document).on("click", ".image-object", function(){
    var elements = $("#builder-canvas").find(".dragble-object").length - 1;
    if (prepare_to_delete) process_element_delete($(this));
  });

  $(document).on("click", ".text-object", function(){
    var elements = $("#builder-canvas").find(".dragble-object").length - 1;
    if (prepare_to_delete) process_element_delete($(this));
  });

  $(document).on("mouseenter", ".video-object", function(){
    if (prepare_to_delete && !$("#builder-canvas").find("#delete_video_selector").length) {
      var $selector = $("#clear-objects .canvas-selector").clone();
      $selector.attr("id", "delete_video_selector");
      $selector.css("width", $(this).css("width"));
      $selector.css("height", $(this).css("height"));
      $("#builder-canvas").prepend($selector);
      $selector.show();
    }
  });

  $(document).on("click", "#delete_video_selector", function(){
    $(this).remove();
    process_element_delete($("#builder-canvas .video-object"));
  });
};

PostBuilder.Tags = function(PostBuilder) {
  function add_new_tag_label() {
    var label = "<div class='tag-label' data-tag='" + $("#add_new_tag").val() + "'>" +
                $("#add_new_tag").val() +
                "<i class='dismiss-tag glyphicon glyphicon-remove'></i></div>";
    $("#tags .panel-body").append(label);
    $("#add_new_tag").val("");
  }

  $(document).on("click", ".dismiss-tag", function(){
    $(this).parent().remove();
  });

  $(document).on("click", "#add_new_tag_submit", function(){
    if ($("#add_new_tag").val().length != "") add_new_tag_label();
  });
};


PostBuilder.CreatePost = function(PostBuilder) {

  function collect_tags() {
    var labels = $("#tags .panel-body").find(".tag-label"),
        result = [];
    $.each(labels, function() {
      result.push($(this).data("tag"));
    });
    return result.join(", ");
  }

  function get_content() {
    if (PostBuilder.post_type === "image") return 
  }

  $("#create_post").click(function() {
    button_loading.start($(this));
    $("#new_post").find("#post_title").val(PostBuilder.post_title);
    $("#new_post").find("#post_description").val(PostBuilder.post_description);
    $("#new_post").find("#post_content_type").val(PostBuilder.post_type);
    $("#new_post").find("#post_tag_list").val(collect_tags());
    if (PostBuilder.post_type === "image") {
      html2canvas(document.getElementById("builder-canvas"), {
        onrendered: function(canvas) {
          PostBuilder.post_content = canvas.toDataURL('image/jpg');
          $("#new_post").find("#post_content").val(PostBuilder.post_content);
          $("#new_post").submit();
        },
        width: 500
      });
    } else {
      PostBuilder.post_content = $("#builder-canvas").find(".video-element").attr("src");
      $("#new_post").find("#post_content").val(PostBuilder.post_content);
      $("#new_post").submit();
    }
  });

};
//http://img.hc360.com/auto/info/images/200709/906-zhuchi13sdgdf.jpg
// http://s1.developerslife.ru/public/images/gifs/19b66bb3-01aa-4429-8c5c-12ab5ed5ec2f.gif