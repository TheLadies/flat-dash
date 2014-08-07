Rails.application.routes.draw do
  root 'data_scrape#index'


  # get '/data' => 'data#index'
  resources :data, only: [:index, :show]
  
  get '/index.html' => 'data_scrape#index' 
  get '/solari_data' => 'data_scrape#solari_data'
end
