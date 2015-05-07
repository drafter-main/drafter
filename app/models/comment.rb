class Comment < Base
  belongs_to :post
  belongs_to :user

  acts_as_tree order: 'created_at DESC'
  acts_as_votable

  before_create do
    generate_short_code
  end

  def rating
    get_upvotes.size - get_downvotes.size
  end
end
