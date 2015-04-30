module ProfilesHelper
  def date_diff(date)
    res = Time.diff(Time.now, date , '%y, %d')
    res[:diff]
  end

  def get_user_avatar(user)
  	user.avatar ? '/content/' + user.folder + "/" + user.avatar : image_path("avatar.png") 
  end
end