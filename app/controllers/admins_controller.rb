class AdminsController < ApplicationController
before_filter :check_if_admin
before_filter :check_user, only: :ban_user
  def users
    @users = User.all
  end

  # банити чи розбанити юзера
  def ban_user
    @user.banned ? @user.update_column(:banned, false) : @user.update_column(:banned, true )
    flash[:alert] = 'Операція пройшла успішно'
    redirect_to users_admins_path
  end

  private

  def check_user
    if @user = User.find_by_id(params[:id])
      if @user == current_user || @user.admin
        flash[:alert] = 'Не можна забанити себе чи іншого адміна'
        redirect_to users_admins_path and return
      end
    else
      flash[:alert] = 'Юзера не знайдено'
      redirect_to users_admins_path
    end
  end
end