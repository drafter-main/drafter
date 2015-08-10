Rails.application.routes.draw do

  get 'password_resets/create'

  get 'password_resets/edit'

  get 'password_resets/update'

root :to => 'posts#index'
resources :user_sessions
resources :users do
  member do
    get :user_posts, to: 'users#user_posts'
    get :user_comments, to: 'users#user_comments'
    get :user_likes, to: 'users#user_likes'
  end
end

resources :password_resets, only: [:create, :update, :edit, :new]

resources :posts do
  collection do
    get :best, to: 'posts#best'
    get :most_recent, to: 'posts#most_recent'
    put :up_vote, to: 'posts#up_vote'
    put :down_vote, to: 'posts#down_vote'
    put :neutral_vote, to: 'posts#neutral_vote'
    get :search, to: 'posts#search'
  end
end

resources :tags, only: [:index, :show] do
  member do
    put :add_to_blacklist
  end
end

resources :comments do
  collection do
    put :up_vote, to: 'comments#up_vote'
    put :down_vote, to: 'comments#down_vote'
    put :neutral_vote, to: 'comments#neutral_vote'
    get 'parent_comment/:code', to: 'comments#parent_comment'
    get 'comment_tree/:code', to: 'comments#comment_tree'
  end
end

resources :profiles, only: [] do
  collection do
    get :my_posts, to: 'profiles#my_posts'
    get :my_comments, to: 'profiles#my_comments'
    get :up_voted, to: 'profiles#up_voted'
    get :settings, to: 'profiles#settings'
    post :change_settings, to: 'profiles#change_settings'
    post :change_password, to: 'profiles#change_password'
    get :social_net_ctrl, to: 'profiles#social_net_ctrl'
  end
end

resources :admins, only: [] do
  collection do
    get :users, to: 'admins#users'
    put :ban_user, to: 'admins#ban_user'
  end
end

post "oauth/callback" => "oauths#callback"
get "oauth/callback" => "oauths#callback" # for use with Github, Facebook
get "oauth/:provider" => "oauths#oauth", :as => :auth_at_provider

get 'login' => 'user_sessions#new', :as => :login
post 'logout' => 'user_sessions#destroy', :as => :logout

get '*path', to: redirect('/')
end
