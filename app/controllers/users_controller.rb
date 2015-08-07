class UsersController < ApplicationController
  before_filter :check_owner, only: [:user_comments, :user_likes, :user_posts]
  
  def new
   @user = User.new
  end

  def create
    @user = User.new(user_params)
    @user.nick = "nick"
    if verify_recaptcha && @user.save
      auto_login(@user)
      redirect_to(root_url, notice: 'Юзер створений')
    else
      flash[:alert] = 'Помилка створення юзера'
      render :new
    end
  end

  def user_posts
    @posts = @user.posts
  end

  def user_comments
    @posts = Post.uniq.joins(:comments).where("comments.user_id = ?", @user.id)
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
