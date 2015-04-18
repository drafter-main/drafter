class AddBannedToUsers < ActiveRecord::Migration
  def change
    add_column :users, :banned_to, :date, default: Time.now
  end
end
