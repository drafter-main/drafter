module ApplicationHelper

  def not_full_profile_message
    # тіп валити його постійно для чуваків, бо пускає без валідації з вк
    return 'Введи емейл та пароль в налаштуваннях' if !current_user.email =~ /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i &&
                                                      current_user.crypted_password.blank?
    return 'Введи пароль в налаштуваннях' if !current_user.email =~ /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i
    'Введи пароль в налаштуваннях' if current_user.crypted_password.blank?
  end

  def is_admin?
    current_user && current_user.admin ? true : false
  end

  def show_right_block?
    res = false

    pages = [{controller: 'posts', action: 'index'},
             {controller: 'posts', action: 'most_recent'}, {controller: 'posts', action: 'best'},
             {controller: 'posts', action: 'show'}, {controller: 'tags', action: 'show'}]

    pages.each do |page|
      if page[:controller] == params[:controller] && page[:action] == params[:action]
        res = true
        break
      end
    end
  res
  end

  def tag_item_active?(id)
    res = false
    res = true if params[:controller] == 'tags' && params[:action] == 'show' && params[:id] == id
    res
  end

  def tags_nav_active?
    res = false
    res = true if params[:controller] == 'tags' && params[:action] == 'show'
    res
  end

  def get_main_logo
  	Rails.public_path + '/logo.png'
  end
end
