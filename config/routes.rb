Rails.application.routes.draw do
  root 'data#index'

  get '/data' => 'data#index'
end
