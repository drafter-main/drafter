module AdminsHelper
 def define_user_class(user)
   return 'danger' if user.banned_to > Time.now
   return 'info' if user.admin
 end

  def ban_or_not_buttons(user)
    if user.banned_to > Time.now
      '<button type="submit" class="btn btn-primary">Розбан</button>'.html_safe
    else
      res = ''
      res << "<select class='form-control' size='1' name='period'>
              <option value='1'>1 день</option>
              <option value='3'>3 дні</option>
              <option value='7'>7 днів</option>
              <option value='30'>30 днів</option>
              <option value='90'>90 днів</option>
              <option value='360'>360 днів</option>
              <option value='10000'>дофіга днів</option>
              </select>"
      res << '<button type="submit" class="btn btn-danger">Бан</button>'
      res.html_safe
end
  end
end