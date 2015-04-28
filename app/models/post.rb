class Post < Base
  belongs_to :user
  has_many :comments

  acts_as_taggable
  acts_as_votable

  validates_presence_of :user_id

  before_create do
    generate_short_code
  end

  def to_param
    code
  end

  def rating
    get_upvotes.size - get_downvotes.size
  end
end
