class Post < Base
  belongs_to :user
  has_many :comments

  acts_as_taggable
  acts_as_votable

  validates_presence_of :user_id
  validates :title, presence: true, length: { in: 3..30 }
  validates :description, length: { in: 0..30 }

  searchable do
    text :title, :boost => 5
    text :description
    time :created_at
  end

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
