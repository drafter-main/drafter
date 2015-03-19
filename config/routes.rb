Rails.application.routes.draw do

root :to => 'posts#index'
resources :user_sessions
resources :users

resources :posts do
  collection do
    put :up_vote, to: 'posts#up_vote'
    put :down_vote, to: 'posts#down_vote'
    put :neutral_vote, to: 'posts#neutral_vote'
  end
end

resources :tags, only: [:index, :show]

resources :comments do
  collection do
    put :up_vote, to: 'comments#up_vote'
    put :down_vote, to: 'comments#down_vote'
    put :neutral_vote, to: 'comments#neutral_vote'
  end
end

resources :profiles, only: [] do
  collection do
    get :my_posts, to: 'profiles#my_posts'
    get :my_comments, to: 'profiles#my_comments'
    get :up_voted, to: 'profiles#up_voted'
    get :settings, to: 'profiles#settings'
    post :change_settings, to: 'profiles#change_settings'
    get :social_net_ctrl, to: 'profiles#social_net_ctrl'
  end
end

post "oauth/callback" => "oauths#callback"
get "oauth/callback" => "oauths#callback" # for use with Github, Facebook
get "oauth/:provider" => "oauths#oauth", :as => :auth_at_provider

get 'login' => 'user_sessions#new', :as => :login
post 'logout' => 'user_sessions#destroy', :as => :logout

end
