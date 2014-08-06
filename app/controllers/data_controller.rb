class DataController < ApplicationController
protect_from_forgery except: :solari_data
    def index
      # Repository.get_repos
      # Repository.make_repos
      # Repository.make_pull_requests
    end

    def show
      render "#{params[:id]}.html"
    end

  def solari_data
    json = Repository.top_pull_requests().to_json

   render json: json, callback: params[:callback]
  end
end
