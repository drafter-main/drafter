class UsersController < ApplicationController
  before_filter :check_owner, only: [:user_comments, :user_likes, :user_posts]
  
  def new
   @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      auto_login(@user)
      redirect_to(root_url, notice: 'User was successfully created')
    else
      render :new
    end
  end

  def user_posts
    @posts = @user.posts
  end

  def user_comments
    @comments = @user.comments
  end

  def user_likes
    @posts = @user.get_up_voted Post
  end

  private

  def check_owner
    @user = current_user
    profile_user = User.find_by_nick(params[:id])
    @self = true if profile_user == @user
    if @self
      redirect_to my_posts_profiles_path
    else
      @user = profile_user
    end
    @votes = @user.votes
  end

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end
end
