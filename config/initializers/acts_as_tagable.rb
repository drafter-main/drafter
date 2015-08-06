ActsAsTaggableOn.remove_unused_tags = true
ActsAsTaggableOn.force_lowercase = true
# issue with migration
ActsAsTaggableOn.force_binary_collation = true

ActsAsTaggableOn::Tag.class_eval do
  # before_create { |tag| tag.slug = Translit.convert(tag.name, :english) }

  def to_param
    name.parameterize
  end
end

