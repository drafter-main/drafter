class Comment < Base
  belongs_to :post
  belongs_to :user
  belongs_to :receiver, class_name: 'User'

  acts_as_votable

  before_create do
    generate_short_code
  end

  after_create do
    set_default_generation
  end

  def rating
    get_upvotes.size - get_downvotes.size
  end

  def set_default_generation
    self.update(generation: self.id) unless self.generation
  end

end
