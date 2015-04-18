class PostsController < ApplicationController
  before_filter :require_login, :except => [:index, :show]
  before_filter :banned?, except: [:index, :show]
  before_filter :check_if_admin, only: [:destroy]

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
    user = current_user
    data = post_params
    data[:published] = to_boolean(data[:published])
    data[:content]= save_post_image(data[:content], user.folder)
    @post = user.posts.new(data)

    if @post.save
      redirect_to(root_url, notice: 'Post was successfully created')
    else
      redirect_to action: :new
    end
  end

  def up_vote
    find_user_and_post
    update_user_rating_up_vote
    @post.vote_by :voter => @user, :vote => 'up'
    render json: {success: true}
  end

  def down_vote
    find_user_and_post
    update_user_rating_down_vote
    @post.vote_by :voter => @user, :vote => 'down'
    render json: {success: true}
  end

  def neutral_vote
    find_user_and_post
    vote = @user.votes.where(votable_type: 'Post', votable_id: @post)[0]
    if vote
       update_user_rating_neutral_vote
       vote.destroy
    end
    render json: {success: true}
  end

  def destroy
    post = Post.find(params[:id])
    render action: :index if post.destroy
  end

  private

  def find_user_and_post
    @user = current_user
    @post = Post.find_by_id(params[:post_id])
  end

  def update_user_rating_neutral_vote
    ratable_user = @post.user
    case @user.voted_as_when_voted_for @post
      when true
        ratable_user.rating -= 1
      when false
        ratable_user.rating += 1
      when nil
        return
    end
    ratable_user.save(:validate => false)
  end

  def update_user_rating_down_vote
    ratable_user = @post.user
    case @user.voted_as_when_voted_for @post
      when true
        ratable_user.rating -= 2
      when false
        return
      when nil
        ratable_user.rating -= 1
    end
    ratable_user.save(:validate => false)
  end

  def update_user_rating_up_vote
    ratable_user = @post.user
    case @user.voted_as_when_voted_for @post
      when true
        return
      when false
        ratable_user.rating += 2
      when nil
        ratable_user.rating += 1
    end
    ratable_user.save(:validate => false)
  end

	def not_authenticated
	  redirect_to root_url, alert: "Please login first"
  end

  def save_post_image(image, folder)
    users_root =  Rails.root.join("public/content/" + folder + "/")
    name = Digest::MD5.hexdigest(folder + Time.now.to_s) + ".png"
    image_data = Base64.decode64(image['data:image/png;base64,'.length .. -1])
    File.open(users_root + name, 'wb') do|f|
      f.write image_data
    end
    name
  end

  def post_params
    params.require(:post).permit(:title, :description, :content, :content_type, :tag_list, :published)
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

  def to_boolean(value)
    value == "true"
  end

end
