class AddCodeToPost < ActiveRecord::Migration
  def change
    add_column :posts, :code, :string
  end
end
