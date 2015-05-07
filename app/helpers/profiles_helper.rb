module ProfilesHelper
  def date_diff(date)
    res = Time.diff(Time.now, date , '%y, %d')
    res[:diff]
  end
end