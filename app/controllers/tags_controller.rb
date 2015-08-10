class TagsController < ApplicationController
  def index
    @tags = ActsAsTaggableOn::Tag.all
  end

  def show
    @tag =  ActsAsTaggableOn::Tag.find_by_name(params[:id])
    @page_title = @tag.name
    @posts = Post.tagged_with(@tag.name)
  end

  def add_to_blacklist

  end
end