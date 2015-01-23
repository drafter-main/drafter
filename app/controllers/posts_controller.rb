class PostsController < ApplicationController
  before_filter :require_login, :except => :index

  def index
    @posts = Post.all
  end

  def show
    @post = Post.find(params[:id])
  end

  def new
    @post = Post.new
  end

  def create
    @post = current_user.posts.create(post_params)
    if @post.save
      redirect_to(root_url, notice: 'Post was successfully created')
    else
      redirect_to action: :new
    end
  end

  private
	def not_authenticated
	  redirect_to root_url, alert: "Please login first"
  end

  def post_params
    params.require(:post).permit(:title, :description, :tag_list)
  end
end
