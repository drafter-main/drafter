class CommentsController < ApplicationController
  before_filter :check_if_admin, only: [:update]
  before_filter :failed_response, only: [:create, :up_vote, :down_vote, :neutral_vote]
  before_filter :require_login, only: [:update]
  before_filter :banned?

  def create
    owner = current_user
    if owner.comments.where('created_at > ?', Time.now - 1.day).length > 60
       render json: {success: false, message: 'Перевищений ліміт'}
    end
    data = comment_params

    if params[:comment][:parent_comment].length > 0 && parent = Comment.find_by(code: params[:comment][:parent_comment])
      data[:parent_id] = parent.id
      data[:receiver_id] = parent.user_id
      data[:generation] = parent.generation
    elsif params[:comment][:receiver]
      receiver = check_receiver(params[:comment][:receiver])
      data[:receiver_id] = check_receiver(params[:comment][:receiver]) if receiver
    end
    
    @comment = owner.comments.new(data)
    if @comment.save
      res = { 
        success: true, 
        code: @comment.code, 
        nick: owner.nick,
        user_path: user_posts_user_path(owner.nick), 
        avatar: get_avatar_thumb(owner) 
      }
      res[:receiver] = receiver_path(@comment) if @comment.receiver
      render json: res
    else
      render json: {success: false}
    end
  end

  def check_receiver(receiver)
    param_nick = User.find_by_nick(receiver)
    param_nick ? param_nick.id : false
  end

  def parent_comment
    comment = Comment.find_by_code(params[:code])
    parent_comment = Comment.find(comment.parent_id)
    if parent_comment
      res = {
        code: parent_comment.code, 
        rating: parent_comment.rating,
        post: parent_comment.post.id,
        vouted: {
          same_user: parent_comment.user.id == current_user.id, 
          status: current_user.voted_as_when_voted_for(parent_comment)
        },
        comment: {
          body: parent_comment.com_body
        },
        user: {
          nick: parent_comment.user.nick,
          path: user_posts_user_path(parent_comment.user.nick)
        }
      }
      res[:comment][:image] = parent_comment.comment_img if parent_comment.comment_img
      res[:success] = true
    else
      res = { success: false }
    end
    render json: res
  end

  def comment_tree
    comment = Comment.find_by_code(params[:code])
    comments = Comment.where(parent_id: comment.id).order("created_at DESC")
    unless comments.empty?
      data = build_comment_tree(comments)
      res = {success: true}
      res[:comments] = data
    else
      res = {success: false}
    end
    render json: res
  end

  def up_vote
    find_user_and_comment
    update_user_rating_up_vote
    @comment.vote_by :voter => @user, :vote => 'up'
    render json: {success: true}
  end

  def down_vote
    find_user_and_comment
    update_user_rating_down_vote
    @comment.vote_by :voter => @user, :vote => 'down'
    render json: {success: true}
  end

  def neutral_vote
    find_user_and_comment
    vote = @user.votes.where(votable_type: 'Comment', votable_id: @comment)[0]
    if vote
      update_user_rating_neutral_vote
      vote.destroy
    end
    render json: {success: true}
  end

  # only ban comment
  def update
    comment = Comment.find(params[:id])
    comment.banned = true
    comment.save
    redirect_to(:back)
  end
 
private

  def build_comment_tree(comments)
    data = []
    comments.each { |comment|
      res = {
        code: comment.code, 
        rating: comment.rating,
        post: comment.post.id,
        vouted: {
          same_user: comment.user.id == current_user.id, 
          status: current_user.voted_as_when_voted_for(comment)
        },
        comment: {
          body: comment.com_body
        },
        user: {
          nick: comment.user.nick,
          path: user_posts_user_path(comment.user.nick)
        }
      }
      res[:comment][:image] = comment.comment_img if comment.comment_img
      data << res
    }
    data
  end

  def find_user_and_comment
    @user = current_user
    @comment = Comment.find_by_code(params[:code])
  end

  def update_user_rating_neutral_vote
    ratable_user = @comment.user
    case @user.voted_as_when_voted_for @comment
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
    ratable_user = @comment.user
    case @user.voted_as_when_voted_for @comment
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
    ratable_user = @comment.user
    case @user.voted_as_when_voted_for @comment
      when true
        return
      when false
        ratable_user.rating += 2
      when nil
        ratable_user.rating += 1
    end
    ratable_user.save(:validate => false)
  end
 
  def comment_params
    params.require(:comment).permit(:post_id, :com_body, :comment_img)
  end

  def failed_response
    render json: { success: false } unless current_user
  end

  def receiver_path(comment)
    receiver = comment.receiver
    {
      nick: "@" + receiver.nick,
      path: user_posts_user_path(receiver.nick)
    }
  end

end
