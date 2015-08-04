module UsersHelper
  def user_profile_active_page(item_index)
  	active = " navigation-item-active".html_safe
  	case item_index
  	when 1
  	  controller.action_name == "user_posts" ? active : ""
  	when 2
  	  controller.action_name == "user_comments" ? active : ""
  	when 3
  	  controller.action_name == "user_likes" ? active : ""
  	end
  end
end
