class ProfilesController < ApplicationController
  before_filter :require_login, :find_user, :set_title

  def my_posts
    @posts = @user.posts.where(published: true)
  end

  def my_comments
    @comments = @user.comments.joins(:post).merge(Post.where(published: true)).order("created_at DESC")
  end

  def up_voted
    @posts = @user.get_up_voted Post
  end

  def settings
    authentications = @user.authentications
    @fb = authentications.where(provider: 'facebook')
    @vk = authentications.where(provider: 'vk')
  end

  def change_settings
    unless validate_change_params(params)
      flash[:alert] = @message
      return redirect_to action: 'settings'
    end
    @user.email = params['email']
    @user.nick = params['nick']
    @user.avatar = save_user_avatar(params[:avatar], @user.folder, @user.avatar, params[:image_square]) if params[:avatar]
    @user.save(validate: false)
    redirect_to action: 'settings'
  end

  def change_password
    if params['old-pass'].present?
      check_pass_confirmation
      if @user.password == params['old-pass']
        update_pass
      else
        flash[:alert] = 'Невірний пароль'
        return redirect_to(settings_profiles_path)
      end
    else
      if @user.crypted_password.present?
        check_pass_confirmation
        update_pass
      else
        update_pass
      end
    end
  end

  def social_net_ctrl
    if params['remove'].present?
      if params['remove'] == 'vk'
        @user.authentications.where(provider: 'vk').first.destroy
      else
        @user.authentications.where(provider: 'facebook').first.destroy
      end
    end
    redirect_to settings_profiles_path
  end

  private

  def update_pass
    @user.password = params['new-pass']
    @user.save(validate: false)
    flash[:alert] = 'Пароль успішно змінений'
    redirect_to action: 'settings'
  end

  def check_pass_confirmation
    unless params['new-pass'] == params['new-pass-confirm']
      flash[:alert] = 'Підтвердження пароля не збіглось'
      redirect_to action: 'settings'
    end
  end

  def validate_change_params(data)
    res = true
    unless (3..10).include?(data['nick'].length)
      @message = 'Формат ніка невірний'
      res = false
    end
    unless data['email'] =~ /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i
      @message = 'Формат емейла невірний'
      res = false
    end
    res
  end

  def find_user
    @user = current_user
    @votes = @user.votes
  end
    
  def set_title
    @page_title = 'профайл'
  end

  def save_user_avatar(image_data, folder, old_name, square)
    image = Magick::Image.from_blob(image_data.read).first
    resize = square.split(",")
    image.crop!(resize[0].to_i, resize[1].to_i, resize[2].to_i, resize[3].to_i)
    image.resize_to_fit!(120)
    name = Digest::MD5.hexdigest(folder + Time.now.to_s) + "." + image.format
    image.write(Rails.root.join("public/content/avatars/" + folder + "/" + name))
    image.resize_to_fit!(50)
    image.write(Rails.root.join("public/content/avatars/" + folder + "/thumb_" + name))
    if old_name
      File.delete(Rails.root.join("public/content/avatars/" + folder + "/" + old_name))
      File.delete(Rails.root.join("public/content/avatars/" + folder + "/thumb_" + old_name))
    end
    name
  end
end