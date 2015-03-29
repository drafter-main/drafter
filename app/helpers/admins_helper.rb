module AdminsHelper
 def define_user_class(user)
   return 'danger' if user.banned
   return 'info' if user.admin
 end

  def ban_or_not_buttons(user)
    if user.banned
      '<button type="submit" class="btn btn-primary">Розбан</button>'.html_safe
    else
      '<button type="submit" class="btn btn-danger">Бан</button>'.html_safe
    end
  end
end