module PostsHelper
  include ActsAsTaggableOn::TagsHelper

  def item_rating(item)
    rating = item.rating
    rating == 1 ? "#{rating} оплеск".html_safe : "#{rating} оплесків".html_safe
  end

  def display_plus_minus(item)
    if current_user
      case current_user.voted_as_when_voted_for(item)
        when true
          str = "<div class='glyphicon glyphicon-thumbs-up plus' data-active='false' data=#{item.code}></div>
          <div class='glyphicon glyphicon-thumbs-down minus col-xs-offset-1' data-active='true' data=#{item.code}></div>"
          str.html_safe
        when false
          str = "<div class='glyphicon glyphicon-thumbs-up plus' data-active='true' data=#{item.code}></div>
          <div class='glyphicon glyphicon-thumbs-down minus col-xs-offset-1' data-active='false' data=#{item.code}></div>"
          str.html_safe
        when nil
          str = "<div class='glyphicon glyphicon-thumbs-up plus' data-active='true' data=#{item.code}></div>
          <div class='glyphicon glyphicon-thumbs-down minus col-xs-offset-1' data-active='true' data=#{item.code}></div>"
          str.html_safe
      end
    else
      str = "<div class='glyphicon glyphicon-thumbs-up plus' data-active='true' data=#{item.code}></div>
          <div class='glyphicon glyphicon-thumbs-down minus col-xs-offset-1' data-active='true' data=#{item.code}></div>"
      str.html_safe
    end
  end

  def image_type_path(content)
    Rails.public_path + '/content/posts/' + content
  end
end
