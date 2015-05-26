class OauthsController < ApplicationController
  skip_before_filter :require_login

  def oauth
    login_at(auth_params[:provider])
  end

  def callback
    provider = auth_params[:provider]
    if @user_main_acc = current_user
      response = sorcery_fetch_user_hash provider
      if auth = Authentication.find_by(uid: response[:uid])
        auth.update(user_id: @user_main_acc.id, provider: provider)
      else
        Authentication.create(uid: response[:uid], provider: provider, user_id: @user_main_acc.id)
      end
      redirect_to settings_profiles_path, :notice => 'Соціальну мережу підключено'
    else
      if @user = login_from(provider)
        redirect_to root_path, :notice => "Увійшов з #{provider.titleize}!"
      else
        begin
          @user = create_from(provider)
          reset_session
          auto_login(@user)
          redirect_to root_path, :notice => "Увійшов з #{provider.titleize}!"
        rescue
          redirect_to root_path, :alert => "Помилка залогінитись #{provider.titleize}!"
        end
      end
    end
  end


  private

   def auth_params
     params.permit(:code, :provider)
   end
end
