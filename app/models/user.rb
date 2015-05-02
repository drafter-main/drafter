class User < ActiveRecord::Base
  authenticates_with_sorcery! do |config|
    config.authentications_class = Authentication
  end

  has_many :comments
  has_many :posts
  has_many :authentications, :dependent => :destroy
  accepts_nested_attributes_for :authentications

  acts_as_voter

  validates :password, length: { minimum: 5 }
  validates :password, confirmation: true
  validates :password_confirmation, presence: true

  validates :nick, presence: true, :uniqueness => {:case_sensitive => false}, length: { in: 3..10 },format: { with: /\w/ }
  validates :email, :uniqueness => {:case_sensitive => false}, presence: true,
            format: { with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i }

  before_create do
    make_user_dir
  end

  before_validation do
    set_nick
  end

  def to_param
    nick
  end

  private

  def make_user_dir
    users_root =  Rails.root.join("public/content/")
    folder_created = Digest::MD5.hexdigest(id.to_s + Time.now.to_s)
    Dir.mkdir(users_root + folder_created)
    self.folder = folder_created
  end

  def set_nick
    @nick = email.split('@').first.downcase[0..6]
    @nick = @nick.gsub(/[^0-9A-Za-z]/, '')
    check_nick(@nick)
    self.nick = @nick
  end

  def check_nick(nick_d)
    if User.find_by_nick(nick_d)
      @nick = nick_d + SecureRandom.hex(1)
      check_nick(@nick)
    end
  end
end
