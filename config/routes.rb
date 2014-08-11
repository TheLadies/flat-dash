Rails.application.routes.draw do
  root 'data_scrape#index'


  # get '/data' => 'data#index'
  resources :data, only: [:index, :show]
  
  # get '/index.html' => 'data_scrape#index' 
  get '/solari_pull_semester' => 'data_scrape#solari_pull_semester'
  get '/solari_pull_week' => 'data_scrape#solari_pull_week'
  get '/solari_pull_day' => 'data_scrape#solari_pull_day'
  get '/latest_commit_messages' => 'data_scrape#latest_commit_messages'
  get '/top_commits_by_user' => 'data_scrape#top_commits_by_user'
  get '/list_of_users' => 'data_scrape#list_of_users'

  get '/week' => 'data_scrape#week'
  get '/day' => 'data_scrape#day'
  get '/commits' => 'data_scrape#commits'
  get '/highlight' => 'data_scrape#highlight'
  get '/heart' => 'data_scrape#heart'

end
