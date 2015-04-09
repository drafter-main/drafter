class UsersController < ApplicationController
  
  def new
   @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      folder = make_user_dir(@user.id)
      @user.update_attribute(:folder, folder)
      auto_login(@user)
      redirect_to(root_url, notice: 'User was successfully created')
    else
      render :new
    end
  end

  private

  def make_user_dir(id)
    users_root =  Rails.root.join("public/content/")
    folder = Digest::MD5.hexdigest(id.to_s + Time.now.to_s)
    Dir.mkdir(users_root + folder)
    folder
    #FileUtils.cp_r(dir_path + 'default_avatar.png', dir_path + path)
  end

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end
end
