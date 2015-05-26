module CommentsHelper
  # def comments_tree_for(comments)
  #   comments.map do |comment, nested_comments|
  #     render(comment) + (nested_comments.size > 0 ? content_tag(:div, comments_tree_for(nested_comments), class: "replies") : nil)
  #   end.join.html_safe
  # end

  def comments_tree_for(comments_tree)
    rendered_comments = ""
    comments_tree.each { |key, comments| rendered_comments += render_generation(comments) }
    rendered_comments.html_safe
  end

  def render_generation(comments)
    rendered_generation = ""
    comments.map { |comment| 
      rendered_generation = comment.id == comment.generation ? render(comment) + rendered_generation : content_tag(:div, render(comment) , class: "replies") + rendered_generation
    }
    rendered_generation
  end

  def comment_content(comment)
    if receiver = comment.receiver
      nick = "@" + receiver.nick
      content = "#{link_to(nick, user_posts_user_path(receiver.nick))} #{comment.com_body}"
    else
      content = comment.com_body
    end
    content.html_safe
  end

  def comments_notification(size)
    if "#{size}".last == "1" && size != 11
      title = "коментар"
    elsif size > 1 && size < 5
      title = "коментарі"
    else
      title = "коментарів"
    end
  	"#{size} #{title}".html_safe
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
