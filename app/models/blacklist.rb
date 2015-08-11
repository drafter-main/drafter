class Blacklist < Base
  serialize :tags, Array

  belongs_to :user
end
