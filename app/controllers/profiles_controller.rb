class ProfilesController < ApplicationController
  before_filter :find_user

  def my_posts
    @posts = @user.posts
  end

  def my_comments
    @comments = @user.comments
  end

  def up_voted
    @posts = @user.get_up_voted Post
  end

  def settings
    authentifications = @user.authentications
    @fb = authentifications.where(provider: 'facebook')
    @vk = authentifications.where(provider: 'vk')
  end

  def change_settings
    binding.pry
  end

  def social_net_ctrl
    if params['remove'].present?
      if params['remove'] == 'vk'
        binding.pry
        @user.authentications.where(provider: 'vk').first.destroy
      else
        @user.authentications.where(provider: 'facebook').first.destroy
      end
    end

    redirect_to settings_profiles_path
  end

  private

  def find_user
    @user = current_user
    @votes = @user.votes
  end
end