module ApplicationHelper
  def is_admin?
    current_user && current_user.admin ? true : false
  end

  def get_main_logo
  	Rails.public_path + '/log.png'
  end
end
