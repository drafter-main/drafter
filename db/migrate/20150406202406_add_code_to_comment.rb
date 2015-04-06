class AddCodeToComment < ActiveRecord::Migration
  def change
    add_column :comments, :code, :string
  end
end
