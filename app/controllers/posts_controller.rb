class PostsController < ApplicationController
  skip_before_filter :require_login, only: [:index]
  
  def index
  end

  private
	def not_authenticated
	  redirect_to login_path, alert: "Please login first"
	end
end
