class DataScrapeController < ApplicationController
  protect_from_forgery except: :solari_data

  def solari_data
    json = Repository.top_pull_requests().to_json

   render json: json, callback: params[:callback]
  end
end