class CreateBlacklist < ActiveRecord::Migration
  def change
    create_table :blacklists do |t|
      t.integer :user_id
      t.text :tags
    end
  end
end
