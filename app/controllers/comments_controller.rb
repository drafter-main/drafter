class CommentsController < ApplicationController
  before_filter :check_if_admin, only: [:update]
  before_filter :failed_response, only: [:create, :up_vote, :down_vote, :neutral_vote]
  before_filter :require_login, only: [:update]
  before_filter :banned?

  def create
    owner = current_user
    data = comment_params
    data[:user_id] = owner.id
    if params[:comment][:parent_comment].length > 0
      parent = Comment.find_by(code: params[:comment][:parent_comment])
      @comment = parent.children.build(data)
	  else
	    @comment = Comment.new(data)
    end

    if @comment.save
      render json: {success: true, code: @comment.code, nick: owner.nick }
    else
      render json: {success: false}
    end
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
    params.require(:comment).permit(:post_id, :com_body)
  end

  def failed_response
    render json: { success: false } unless current_user
  end

end
