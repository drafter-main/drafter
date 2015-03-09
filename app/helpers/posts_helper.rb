module PostsHelper
  include ActsAsTaggableOn::TagsHelper

  def post_rating(post)
    post.get_upvotes.size - post.get_downvotes.size
  end

  def display_plus_minus(post)
    if current_user
      case current_user.voted_as_when_voted_for(post)
        when true
          str = "<div class='glyphicon glyphicon-thumbs-up plus' data-active='false' data=#{post.id}></div>
          <div class='glyphicon glyphicon-thumbs-down minus col-xs-offset-1' data-active='true' data=#{post.id}></div>"
          str.html_safe
        when false
          str = "<div class='glyphicon glyphicon-thumbs-up plus' data-active='true' data=#{post.id}></div>
          <div class='glyphicon glyphicon-thumbs-down minus col-xs-offset-1' data-active='false' data=#{post.id}></div>"
          str.html_safe
        when nil
          str = "<div class='glyphicon glyphicon-thumbs-up plus' data-active='true' data=#{post.id}></div>
          <div class='glyphicon glyphicon-thumbs-down minus col-xs-offset-1' data-active='true' data=#{post.id}></div>"
          str.html_safe
      end
    else
      str = "<div class='glyphicon glyphicon-thumbs-up plus' data-active='true' data=#{post.id}></div>
          <div class='glyphicon glyphicon-thumbs-down minus col-xs-offset-1' data-active='true' data=#{post.id}></div>"
      str.html_safe
    end
  end
end
