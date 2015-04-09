class Post < ActiveRecord::Base
  belongs_to :user
  has_many :comments

  acts_as_taggable
  acts_as_votable

  validates_presence_of :user_id
end
