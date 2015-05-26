class AddGenerationToComments < ActiveRecord::Migration
  def change
    add_column :comments, :generation, :integer
  end
end
