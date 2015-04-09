class Comment < ActiveRecord::Base
  belongs_to :post
  belongs_to :user

  acts_as_tree order: 'created_at DESC'
  acts_as_votable
end
