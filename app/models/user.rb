class User < ActiveRecord::Base
  authenticates_with_sorcery! do |config|
    config.authentications_class = Authentication
  end

  has_many :comments
  has_many :posts
  has_many :authentications, :dependent => :destroy
  accepts_nested_attributes_for :authentications

  acts_as_voter

  validates :password, length: { minimum: 3 }
  validates :password, confirmation: true
  validates :password_confirmation, presence: true

  validates :email, uniqueness: true

  after_create :set_nick

  private

  def set_nick
    nick = email.split('@').first
    update_column(:nick, nick)
  end
end
