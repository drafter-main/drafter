class Post < ActiveRecord::Base
  belongs_to :user
  has_many :comments

  acts_as_taggable

  validates :user_id, presence: true
end
