Rails.application.routes.draw do
  root 'data_scrape#index'


  # get '/data' => 'data#index'
  resources :data, only: [:index, :show]
  
  # get '/index.html' => 'data_scrape#index' 
  get '/solari_pull_semester' => 'data_scrape#solari_pull_semester'
  get '/week' => 'data_scrape#week'
  get '/day' => 'data_scrape#day'
end
