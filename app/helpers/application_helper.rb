module ApplicationHelper
  def is_admin?
    current_user && current_user.admin ? true : false
  end
end
