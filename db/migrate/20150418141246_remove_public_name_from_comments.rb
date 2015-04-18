class RemovePublicNameFromComments < ActiveRecord::Migration
  def change
    remove_column :comments, :public_name, :string
  end
end
