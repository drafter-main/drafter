class PostsController < ApplicationController
  before_filter :require_login, :except => [:index, :show]

  def index
    @posts = Post.includes(:comments).all
  end

  def show
    @post = Post.find(params[:id])
    @comments = Comment.includes(:user).where(post_id: @post.id).hash_tree
    @comments_count = comments_count(@comments)
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

  def comments_count(comments)
    count = 0
    count += comments.length
    if comments.length > 0
      comments.each do |comment, nested_comments|
        count += comments_count(nested_comments)
      end
    end
    count
  end
end
