class TagsController < ApplicationController
  before_filter :require_login, only: [:add_to_blacklist]
  before_filter :find_tag, only: [:show]

  def show
    @page_title = @tag.name
    @posts = Post.tagged_with(@tag.name)
  end

  def add_to_blacklist
    @user = User.includes(:blacklist).where(id: session[:user_id]).first

    if @user.blacklist.present?
      has_blacklist_perform
    else
      new_blacklist_perform
    end
  end

  private

  def has_blacklist_perform
    @user.blacklist.tags << params[:id]
    @user.blacklist.tags.uniq!
    if @user.blacklist.save
      redirect_to(root_url, notice: 'Таг доданий до блекліста')
    else
      flash[:alert] = 'Помилка створення блекліста'
      redirect_to root_url
    end
  end

  def new_blacklist_perform
    blacklist = Blacklist.new(user_id: @user.id)
    blacklist.tags << params[:id]
    blacklist.tags.uniq!
    if blacklist.save
      redirect_to(root_url, notice: 'Таг доданий до блекліста')
    else
      flash[:alert] = 'Помилка створення блекліста'
      redirect_to root_url
    end
  end

  def find_tag
    @tag =  ActsAsTaggableOn::Tag.find_by_name(params[:id])
  end
end