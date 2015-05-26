class TagsController < ApplicationController
  def index
    @tags = ActsAsTaggableOn::Tag.all
  end

  def show
    @tag =  ActsAsTaggableOn::Tag.find_by_slug(params[:id])
    @page_title = @tag.name
    @posts = Post.tagged_with(@tag.name)
  end
end