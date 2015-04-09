class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception


  layout 'application'
  before_filter :set_constants

  def set_constants
    @tags = ActsAsTaggableOn::Tag.most_used(10)
  end

  def check_if_admin
    redirect_to posts_path, alert: 'Заборонено' unless current_user && current_user.admin
  end
end
