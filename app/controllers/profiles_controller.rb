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

  end

  def change_settings
    binding.pry
  end

  private

  def find_user
    @user = current_user
    @votes = @user.votes
  end
end