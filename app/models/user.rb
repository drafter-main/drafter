class User < Base
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
  after_create :make_user_dir

  before_create do
    generate_short_code
  end

  private

  def make_user_dir
    users_root =  Rails.root.join("public/content/")
    folder = Digest::MD5.hexdigest(id.to_s + Time.now.to_s)
    Dir.mkdir(users_root + folder)
    update_attribute(:folder, folder)
  end

  def set_nick
    nick = email.split('@').first
    update_column(:nick, nick)
  end
end
