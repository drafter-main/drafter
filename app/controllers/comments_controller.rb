class CommentsController < ApplicationController

  def create
    if params[:comment][:parent_comment].to_i > 0
      data = comment_params
      data[:user_id] = current_user.id
      parent = Comment.find_by_id(params[:comment].delete(:parent_comment))
      @comment = parent.children.build(data)
	  else
	    @comment = current_user.comments.new(comment_params)
    end

	if @comment.save
	  render json: {success: true, id: @comment.id, email: current_user.email }
	else
	  render json: {success: false}
	end
  end
 
private
 
  def comment_params
    params.require(:comment).permit(:post_id, :com_body)
  end

end
