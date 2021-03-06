class PostsController < ApplicationController
  before_filter :failed_response, only: [:up_vote, :down_vote, :neutral_vote]
  before_filter :require_login, :except => [:index, :show, :best, :most_recent]
  before_filter :banned?, except: [:index, :show]
  before_filter :check_if_admin, only: [:destroy]

  def index
    @page_title = 'гаряче'
    posts = []
    @posts = Post.includes(:comments).where(published: true).order(created_at: :desc)
    @posts.each{|p| posts << p if p.rating >= 0}
    @posts = posts
  end

  def best
    @page_title = 'найкраще'
    @posts = Post.includes(:comments).where(published: true).order(created_at: :desc)
    @posts.sort_by {|post| post.rating }.reverse
    render 'posts/index'
  end

  def most_recent
    @page_title = 'свіже'
    @posts = Post.includes(:comments).where(published: true).order(created_at: :desc)
    render 'posts/index'
  end

  def show
    @post = Post.find_by_code(params[:id])
    redirect_to root_path unless @post.published
    @page_title = @post.title
    @comments = Comment.includes(:user).where(post_id: @post.id).order("created_at desc").group_by(&:generation)
    @comments_count = comments_count(@comments)
  end

  def new
    @post = Post.new
  end

  def create
    user = current_user
    if user.comments.where('created_at > ?', Time.now - 1.day).length > 60
      render json: {success: false, message: 'Перевищений ліміт'}
    end

    data = post_params
    data[:published] = true
    data[:content]= save_post_image(data[:content], user.folder) if data[:content_type] == "image"
    @post = user.posts.new(data)

    if @post.save
      redirect_to(@post, notice: 'Публікація створена')
    else
      redirect_to action: :new
    end
  end

  def up_vote
    find_user_and_post
    update_user_rating_up_vote
    @post.vote_by :voter => @user, :vote => 'up'
    render json: {success: true, rating: @post.rating}
  end

  def down_vote
    find_user_and_post
    update_user_rating_down_vote
    @post.vote_by :voter => @user, :vote => 'down'
    render json: {success: true, rating: @post.rating}
  end

  def neutral_vote
    find_user_and_post
    vote = @user.votes.where(votable_type: 'Post', votable_id: @post)[0]
    if vote
       update_user_rating_neutral_vote
       vote.destroy
    end
    render json: {success: true, rating: @post.rating}
  end

  def destroy
    post = Post.find(params[:id])
    render action: :index if post.destroy
  end

  def search
    @search = Post.search do
      fulltext params[:search]
    end
    @posts = @search.results
    render :index
  end

  private

  def rating

  end

  def find_user_and_post
    @user = current_user
    @post = Post.find_by_code(params[:code])
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
    users_root =  Rails.root.join("public/content/posts/" + folder + "/")
    name = Digest::MD5.hexdigest(folder + Time.now.to_s) + ".jpg"
    image_data = Magick::Image.from_blob(Base64.decode64(image['data:image/jpg;base64,'.length .. -1])).first

    image_data.format = "JPEG"
    size = image_data.filesize / 1024
    
    if size > 600 
      image_data.write(users_root + name) {self.quality = 80}
    else
      image_data.write(users_root + name) 
    end
    
    folder + "/" + name
  end

  def post_params
    params.require(:post).permit(:title, :description, :content, :content_type, :tag_list)
  end

  def comments_count(comments_group)
    count = 0
    comments_group.each { |key, value| count += value.length } if comments_group.length > 0
    count
  end

  def to_boolean(value)
    value == "true"
  end

  def failed_response
    render json: { success: false } unless current_user
  end

end
