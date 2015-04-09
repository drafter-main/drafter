class UserSessionsController < ApplicationController
  skip_before_filter :require_login, except: [:destroy]

  def create
    if @user = login(params[:email], params[:password])
      redirect_back_or_to(root_url, notice: 'Login successful')
    else
      flash.now[:alert] = 'Login failed'
      redirect_to(root_url)
    end
  end

  def destroy
    logout
    redirect_to(root_url, notice: 'Logged out!')
  end
end
