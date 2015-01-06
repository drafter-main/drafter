class SorceryCore < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :email,            :default => nil
      t.string :crypted_password, :default => nil
      t.string :salt,             :default => nil

      t.timestamps
    end

    add_index :users, :email, unique: true
  end
end