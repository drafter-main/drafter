module ProfilesHelper
  def date_diff(date)
    res = Time.diff(Time.now, date , '%y, %d')
    res[:diff]
  end

  def active_page(item_index)
  	active = " navigation-item-active".html_safe
  	case item_index
  	when 1
  	  controller.action_name == "my_posts" ? active : ""
  	when 2
  	  controller.action_name == "my_comments" ? active : ""
  	when 3
  	  controller.action_name == "up_voted" ? active : ""
  	when 4
  	  controller.action_name == "settings" ? active : ""
  	end
  end
end