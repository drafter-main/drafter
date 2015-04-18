module CommentsHelper
  def comments_tree_for(comments)
    comments.map do |comment, nested_comments|
      render(comment) + (nested_comments.size > 0 ? content_tag(:div, comments_tree_for(nested_comments), class: "replies") : nil)
    end.join.html_safe
  end

  def comments_notification(size)
  	size > 0 && size < 5 ? name = "коммент" : name = "комментів"
  	"#{size} #{name}".html_safe
  end

  def display_plus_minus_comment(item)
    if current_user
      case current_user.voted_as_when_voted_for(item)
        when true
          str = "<div class='glyphicon glyphicon-thumbs-up plus-comment' data-active='false' data=#{item.code}></div>
                <div class='glyphicon glyphicon-thumbs-down minus-comment' data-active='true' data=#{item.code}></div>"
          str.html_safe
        when false
          str = "<div class='glyphicon glyphicon-thumbs-up plus-comment' data-active='true' data=#{item.code}></div>
                <div class='glyphicon glyphicon-thumbs-down minus-comment' data-active='false' data=#{item.code}></div>"
          str.html_safe
        when nil
          str = "<div class='glyphicon glyphicon-thumbs-up plus-comment' data-active='true' data=#{item.code}></div>
                <div class='glyphicon glyphicon-thumbs-down minus-comment' data-active='true' data=#{item.code}></div>"
          str.html_safe
      end
    else
      str = "<div class='glyphicon glyphicon-thumbs-up plus-comment' data-active='true' data=#{item.code}></div>
            <div class='glyphicon glyphicon-thumbs-down minus-comment' data-active='true' data=#{item.code}></div>"
      str.html_safe
    end
  end
end
