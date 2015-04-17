class AddPublicNameToComments < ActiveRecord::Migration
  def change
    add_column :comments, :public_name, :string
  end
end
