class Base < ActiveRecord::Base
  self.abstract_class = true

  def generate_short_code
    self.code = SecureRandom.hex(7)
    while self.class.exists?(code: code)
      self.code = SecureRandom.hex(7)
    end
  end
end