class DataScrapeController < ApplicationController
  protect_from_forgery except: :solari_data
  def index
      def solari_pull_semester
        json = Repository.top_pull_requests().to_json

        render json: json, callback: params[:callback]
      end
  end

  def week
    def solari_pull_week
      json = Repository.week_ago_pull_requests().to_json

      render json: json, callback: params[:callback]
    end
  end

  def day
    def solari_pull_day
      json = Repository.todays_pull_requests().to_json

      render json: json, callback: params[:callback]
    end
  end

  def commits
    def solari_pull_day
      json = Repository.todays_pull_requests().to_json

      render json: json, callback: params[:callback]
    end
  end

  def highlight
    def solari_pull_day
      json = Repository.todays_pull_requests().to_json

      render json: json, callback: params[:callback]
    end
  end  

  def heart
    def solari_pull_day
      json = Repository.todays_pull_requests().to_json

      render json: json, callback: params[:callback]
    end
  end

end