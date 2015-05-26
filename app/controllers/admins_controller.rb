class AdminsController < ApplicationController
before_filter :check_if_admin
before_filter :check_user, only: :ban_user

  def users
    @page_title = 'Адмінка'
    @users = User.all
  end

  # банити чи розбанити юзера
  def ban_user
    ban_time = Time.now + params['period'].to_i.days
    @user.banned_to > Time.now ? @user.update_column(:banned_to, Time.now) : @user.update_column(:banned_to, ban_time )
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