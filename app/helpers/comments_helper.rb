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
end
