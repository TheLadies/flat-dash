Rails.application.routes.draw do
  resources :tweets

  root 'data_scrape#index'


  # get '/data' => 'data#index'
  resources :data, only: [:index, :show]
  
  get '/solari_pull_semester' => 'data_scrape#solari_pull_semester'
  get '/solari_pull_week' => 'data_scrape#solari_pull_week'
  get '/todays_pull_requests' => 'data_scrape#todays_pull_requests'
  get '/latest_commit_messages' => 'data_scrape#latest_commit_messages'
  get '/user_commits' => 'data_scrape#user_commits'
  get '/list_of_users' => 'data_scrape#list_of_users'

  get '/index' => 'data_scrape#index'
  get '/semester' => 'data_scrape#semester'
  get '/week' => 'data_scrape#week'
  get '/day' => 'data_scrape#day'
  get '/commits' => 'data_scrape#commits'
  get '/highlight' => 'data_scrape#highlight'
  get '/heart' => 'data_scrape#heart'

end
