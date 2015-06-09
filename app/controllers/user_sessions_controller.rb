class UserSessionsController < ApplicationController
  skip_before_filter :require_login, except: [:destroy]

  def create
    if @user = login(params[:email], params[:password], params[:remember])
      redirect_back_or_to(root_url, notice: 'Успішно увійшли')
    else
      flash.now[:alert] = 'Помилка входу'
      redirect_to(root_url)
    end
  end

  def destroy
    logout
    redirect_to(root_url, notice: 'Успішно вийшли')
  end
end
