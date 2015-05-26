class AddCommentImgToComments < ActiveRecord::Migration
  def change
    add_column :comments, :comment_img, :string
  end
end
