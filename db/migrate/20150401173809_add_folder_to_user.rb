class AddFolderToUser < ActiveRecord::Migration
  def change
    add_column :users, :folder, :string
  end
end
